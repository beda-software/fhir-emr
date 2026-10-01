import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

import type { SignOutReason } from 'src/services/auth';

export interface SessionRejectionDeps {
    baseURL: string;
    getToken: () => string | undefined;
    isIdleTimeoutElapsed: () => boolean;
    endSession: (reason: SignOutReason) => void | Promise<void>;
    // Resolves the new access token; undefined (no refresh credential) or a rejection means refresh is impossible.
    refreshSession: () => Promise<string | undefined>;
}

type WasReplaced = (config: InternalAxiosRequestConfig) => boolean;

type ReplayableConfig = InternalAxiosRequestConfig & { _sessionReplayed?: boolean };

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

// Returns the eject function. The original rejection always reaches the caller, unless a
// Token Refresh lets the request be replayed successfully.
export function installSessionRejectionInterceptor(instance: AxiosInstance, deps: SessionRejectionDeps): () => void {
    let sharedRefresh: Promise<string | undefined> | undefined;
    const replacedTokens = new Set<string>();
    const wasReplaced: WasReplaced = (config) =>
        [...replacedTokens].some((t) => getAuthorization(config) === `Bearer ${t}`);

    // Never throws: a failed refresh is the same outcome as no refresh.
    function refreshSharedOnce(): Promise<string | undefined> {
        sharedRefresh ??= (async () => {
            const previousToken = deps.getToken();
            const fresh = await deps.refreshSession().catch(() => undefined);
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
        const fresh = await resolveFreshToken(config);
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
