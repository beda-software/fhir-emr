import { createHash, randomBytes } from 'node:crypto';

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

const REFRESH_CLIENT_REDIRECT_URI = 'http://localhost:3000/auth';

async function signInWithRefreshClient() {
    const verifier = randomBytes(32).toString('base64url');
    const challenge = createHash('sha256').update(verifier).digest('base64url');

    const authorizeParams = {
        client_id: 'testAuthRefresh',
        response_type: 'code',
        redirect_uri: REFRESH_CLIENT_REDIRECT_URI,
        code_challenge: challenge,
        code_challenge_method: 'S256',
    };
    const noRedirects = { adapter: 'http' as const, maxRedirects: 0, validateStatus: () => true };
    const toCookie = (response: { headers: Record<string, unknown> }) =>
        ((response.headers['set-cookie'] as string[] | undefined) ?? []).map((c) => c.split(';')[0]).join('; ');

    const loginPage = await axios.get<string>(`${config.baseURL}/auth/login`, {
        params: authorizeParams,
        ...noRedirects,
    });
    const csrf = /name="_csrf"[^>]*value="([^"]*)"/.exec(loginPage.data)?.[1] ?? '';
    const loginResponse = await axios.post(
        `${config.baseURL}/auth/login`,
        new URLSearchParams({ _csrf: csrf, username: 'admin', password: 'password' }),
        { params: authorizeParams, headers: { Cookie: toCookie(loginPage) }, ...noRedirects },
    );
    const cookie = [toCookie(loginPage), toCookie(loginResponse)].join('; ');

    const authorizeResponse = await axios.get(`${config.baseURL}/auth/authorize`, {
        params: authorizeParams,
        headers: { Cookie: cookie },
        ...noRedirects,
    });
    const code = new URL(authorizeResponse.headers.location).searchParams.get('code');

    const { data } = await axios.post<{ access_token: string; refresh_token: string }>(
        `${config.baseURL}/auth/token`,
        new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: 'testAuthRefresh',
            code: code!,
            redirect_uri: REFRESH_CLIENT_REDIRECT_URI,
            code_verifier: verifier,
        }),
    );
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
    const originalConfig = {
        clientId: config.clientId,
        authFlow: config.authFlow,
        authTokenPath: config.authTokenPath,
    };
    let uninstall: () => void = () => undefined;

    beforeEach(() => {
        installFakeLocalStorage();
        config.clientId = 'testAuthRefresh';
        config.authFlow = 'code';
        config.authTokenPath = 'auth/token';
    });

    afterEach(() => {
        Object.assign(config, originalConfig);
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
