import { isAxiosError, type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

import type { SignOutReason } from 'src/services/auth';

export interface SessionRejectionDeps {
    baseURL: string;
    getToken: () => string | undefined;
    isIdleTimeoutElapsed: () => boolean;
    endSession: (reason: SignOutReason) => void | Promise<void>;
    // Resolves the new access token; undefined means there is no refresh credential. Rejects with the
    // request error; only a rejected refresh token (see isRefreshTokenRejected) ends the Session.
    refreshSession: () => Promise<string | undefined>;
}

type WasReplaced = (config: InternalAxiosRequestConfig) => boolean;

type ReplayableConfig = InternalAxiosRequestConfig & { _sessionReplayed?: boolean };

interface Installation {
    eject: () => void;
    holders: number;
}

const installations = new WeakMap<AxiosInstance, Installation>();

// A network failure, timeout or 5xx says nothing about the refresh token, so it must not end the Session.
export function isRefreshTokenRejected(error: unknown): boolean {
    return isAxiosError(error) && (error.response?.status === 400 || error.response?.status === 401);
}

const SESSION_MANAGEMENT_PATH = /^\/(auth\/token|Session)(\/|\?|$)/;

function getAuthorization(config: InternalAxiosRequestConfig): string | undefined {
    const value = config.headers?.Authorization ?? config.headers?.get?.('Authorization');

    return typeof value === 'string' ? value : undefined;
}

function resolveRequestUrl(config: InternalAxiosRequestConfig): URL | undefined {
    const url = config.url ?? '';
    const absolute = /^https?:\/\//.test(url)
        ? url
        : `${(config.baseURL ?? '').replace(/\/$/, '')}/${url.replace(/^\//, '')}`;

    try {
        return new URL(absolute);
    } catch {
        return undefined;
    }
}

function isSessionManagementRequest(url: URL, baseURL: string): boolean {
    const basePath = new URL(baseURL).pathname.replace(/\/$/, '');

    return SESSION_MANAGEMENT_PATH.test(url.pathname.slice(basePath.length));
}

// An empty Bearer, Basic auth (anonymous flows) and SMART-app tokens never match the
// Session's own token, so they are not Session rejections. A token that a refresh has just
// replaced still counts: its request was in flight when the refresh finished.
function isSessionRejection(error: AxiosError, deps: SessionRejectionDeps, wasReplaced: WasReplaced): boolean {
    const { config, response } = error;
    const token = deps.getToken();

    if (!config || response?.status !== 401 || !token) {
        return false;
    }
    if (getAuthorization(config) !== `Bearer ${token}` && !wasReplaced(config)) {
        return false;
    }

    const url = resolveRequestUrl(config);

    return (
        !!url &&
        url.origin === new URL(deps.baseURL).origin &&
        url.pathname.startsWith(new URL(deps.baseURL).pathname) &&
        !isSessionManagementRequest(url, deps.baseURL)
    );
}

// Returns the release function. A client gets one interceptor however many callers install it:
// a second copy would retry a failed refresh and end the Session twice. The first caller's deps
// stay in effect until the last holder releases it.
export function installSessionRejectionInterceptor(instance: AxiosInstance, deps: SessionRejectionDeps): () => void {
    const installation = installations.get(instance) ?? createInstallation(instance, deps);
    installation.holders += 1;
    let released = false;

    return () => {
        if (released) {
            return;
        }

        released = true;
        releaseInstallation(instance, installation);
    };
}

function createInstallation(instance: AxiosInstance, deps: SessionRejectionDeps): Installation {
    const installation = { eject: addSessionRejectionInterceptor(instance, deps), holders: 0 };
    installations.set(instance, installation);

    return installation;
}

// The original rejection always reaches the caller, unless a Token Refresh lets the request be
// replayed successfully.
function addSessionRejectionInterceptor(instance: AxiosInstance, deps: SessionRejectionDeps): () => void {
    let sharedRefresh: Promise<string | undefined> | undefined;
    const replacedTokens = new Set<string>();
    const wasReplaced: WasReplaced = (config) =>
        [...replacedTokens].some((t) => getAuthorization(config) === `Bearer ${t}`);

    // Resolves undefined when refresh is impossible (no credential, or the token was rejected);
    // any other failure is transient and propagates.
    function refreshSharedOnce(): Promise<string | undefined> {
        sharedRefresh ??= (async () => {
            const previousToken = deps.getToken();
            const fresh = await deps.refreshSession().catch((refreshError: unknown) => {
                if (isRefreshTokenRejected(refreshError)) {
                    return undefined;
                }

                throw refreshError;
            });
            if (fresh && previousToken) {
                replacedTokens.add(previousToken);
            }

            return fresh;
        })().finally(() => {
            sharedRefresh = undefined;
        });

        return sharedRefresh;
    }

    async function resolveFreshToken(config: ReplayableConfig): Promise<string | undefined> {
        if (config._sessionReplayed) {
            return undefined;
        }

        return wasReplaced(config) ? deps.getToken() : refreshSharedOnce();
    }

    const id = instance.interceptors.response.use(undefined, async (error: AxiosError) => {
        if (!isSessionRejection(error, deps, wasReplaced)) {
            return Promise.reject(error);
        }
        if (deps.isIdleTimeoutElapsed()) {
            void deps.endSession('forced');

            return Promise.reject(error);
        }

        const config = error.config as ReplayableConfig;
        let fresh: string | undefined;
        try {
            fresh = await resolveFreshToken(config);
        } catch {
            return Promise.reject(error);
        }
        const idleTimeoutElapsed = deps.isIdleTimeoutElapsed();
        if (!fresh || idleTimeoutElapsed) {
            void deps.endSession(idleTimeoutElapsed ? 'forced' : 'expired');

            return Promise.reject(error);
        }
        config._sessionReplayed = true;
        config.headers.set('Authorization', `Bearer ${fresh}`);

        return instance.request(config);
    });

    return () => instance.interceptors.response.eject(id);
}

function releaseInstallation(instance: AxiosInstance, installation: Installation): void {
    installation.holders -= 1;
    if (installation.holders > 0) {
        return;
    }

    installation.eject();
    installations.delete(instance);
}
