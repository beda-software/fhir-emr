import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

import type { SignOutReason } from 'src/services/auth';

export interface SessionRejectionDeps {
    baseURL: string;
    getToken: () => string | undefined;
    isIdleTimeoutElapsed: () => boolean;
    endSession: (reason: SignOutReason) => void | Promise<void>;
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
// Session's own token, so they are not Session rejections.
function isSessionRejection(error: AxiosError, deps: SessionRejectionDeps): boolean {
    const { config, response } = error;
    const token = deps.getToken();

    if (!config || response?.status !== 401 || !token) {
        return false;
    }
    if (getAuthorization(config) !== `Bearer ${token}`) {
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

// Returns the eject function. The original rejection always reaches the caller.
export function installSessionRejectionInterceptor(instance: AxiosInstance, deps: SessionRejectionDeps): () => void {
    const id = instance.interceptors.response.use(undefined, (error: AxiosError) => {
        if (isSessionRejection(error, deps)) {
            void deps.endSession(deps.isIdleTimeoutElapsed() ? 'forced' : 'expired');
        }

        return Promise.reject(error);
    });

    return () => instance.interceptors.response.eject(id);
}
