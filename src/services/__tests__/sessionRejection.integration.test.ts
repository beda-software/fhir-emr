import axios from 'axios';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import config from '@beda.software/emr-config';

import { getToken, logout, refreshSession, setRefreshToken, setToken } from 'src/services/auth';
import { axiosInstance, resetInstanceToken, setInstanceToken } from 'src/services/fhir';
import { installSessionRejectionInterceptor } from 'src/services/sessionRejection';
import { login } from 'src/setupTests';

import { installFakeLocalStorage } from './fakeLocalStorage';

// Both suites share one file: a server-side logout revokes the admin's other Sessions, so they must not run in parallel.

// Detects Aidbox drift from what the interceptor relies on: a revoked Session yields 401.
describe('session rejection against a real Aidbox', () => {
    it('ends the Session as expired when a request follows server-side revocation', async () => {
        const token = await login({ email: 'admin', id: 'admin', password: 'password' } as never);
        const endSession = vi.fn();
        const eject = installSessionRejectionInterceptor(axiosInstance, {
            baseURL: config.baseURL,
            getToken: () => token.access_token,
            isIdleTimeoutElapsed: () => false,
            endSession,
            refreshSession: async () => undefined,
        });

        try {
            await logout();
            expect(endSession).not.toHaveBeenCalled();

            await expect(axiosInstance.get('/fhir/Patient', { params: { _count: 1 } })).rejects.toMatchObject({
                response: { status: 401 },
            });

            expect(endSession).toHaveBeenCalledTimes(1);
            expect(endSession).toHaveBeenCalledWith('expired');
        } finally {
            eject();
        }
    });
});

const ACCESS_TOKEN_LIFETIME_MS = 4_000;
const REFRESH_TOKEN_LIFETIME_MS = 10_000;
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function signInWithRefreshClient() {
    const { data } = await axios.post<{ access_token: string; refresh_token: string }>(`${config.baseURL}/auth/token`, {
        grant_type: 'password',
        client_id: 'testAuthRefresh',
        client_secret: '123456',
        username: 'admin',
        password: 'password',
    });
    setToken(data.access_token);
    setRefreshToken(data.refresh_token);
    setInstanceToken({ access_token: data.access_token, token_type: 'Bearer' });

    return data;
}

describe('token refresh against a real Aidbox', () => {
    const endSession = vi.fn();
    const install = () =>
        installSessionRejectionInterceptor(axiosInstance, {
            baseURL: config.baseURL,
            getToken,
            isIdleTimeoutElapsed: () => false,
            endSession,
            refreshSession,
        });
    const originalClientId = config.clientId;
    let uninstall: () => void = () => undefined;

    beforeEach(() => {
        installFakeLocalStorage();
        config.clientId = 'testAuthRefresh';
    });

    afterEach(() => {
        config.clientId = originalClientId;
        uninstall();
        endSession.mockReset();
        resetInstanceToken();
        localStorage.clear();
    });

    it('refreshes and replays a request made after the access token expired', async () => {
        const signedIn = await signInWithRefreshClient();
        uninstall = install();
        await sleep(ACCESS_TOKEN_LIFETIME_MS + 1_000);

        const response = await axiosInstance.get('/fhir/Patient', { params: { _count: 1 } });

        expect(response.status).toBe(200);
        expect(getToken()).not.toBe(signedIn.access_token);
        expect(localStorage.getItem('refresh_token')).toBe(signedIn.refresh_token);
        expect(endSession).not.toHaveBeenCalled();
    }, 15_000);

    it('ends as expired when the refresh token has expired too', async () => {
        await signInWithRefreshClient();
        uninstall = install();
        await sleep(REFRESH_TOKEN_LIFETIME_MS + 1_000);

        await expect(axiosInstance.get('/fhir/Patient', { params: { _count: 1 } })).rejects.toMatchObject({
            response: { status: 401 },
        });

        expect(endSession).toHaveBeenCalledTimes(1);
        expect(endSession).toHaveBeenCalledWith('expired');
    }, 20_000);
});
