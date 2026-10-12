import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import config from '@beda.software/emr-config';
import { isFailure, isSuccess } from '@beda.software/remote-data';

import { exchangeAuthorizationCodeForToken, getSignInUrl, parseOAuthState } from 'src/services/auth';
import { createCodeChallenge, createCodeVerifier } from 'src/services/pkce';

function installFakeSessionStorage() {
    const store = new Map<string, string>();
    Object.defineProperty(window, 'sessionStorage', {
        configurable: true,
        writable: true,
        value: {
            getItem: (key: string) => (store.has(key) ? store.get(key)! : null),
            setItem: (key: string, value: string) => store.set(key, value),
            removeItem: (key: string) => store.delete(key),
            clear: () => store.clear(),
        },
    });
}

const mutableConfig = config as unknown as Record<string, unknown>;

describe('PKCE code-grant sign-in', () => {
    beforeEach(() => {
        installFakeSessionStorage();
        mutableConfig.authFlow = 'code';
        mutableConfig.authTokenPath = 'auth/token';
        mutableConfig.authClientRedirectURL = 'http://localhost:3000/auth';
    });

    afterEach(() => {
        vi.restoreAllMocks();
        delete mutableConfig.authFlow;
        delete mutableConfig.authTokenPath;
        delete mutableConfig.authClientRedirectURL;
    });

    describe('verifier and challenge', () => {
        it('creates a fresh url-safe verifier each time', () => {
            const a = createCodeVerifier();
            const b = createCodeVerifier();

            expect(a).not.toBe(b);
            expect(a).toMatch(/^[A-Za-z0-9\-._~]{43,128}$/);
        });

        it('derives the S256 challenge from RFC 7636 appendix B', async () => {
            await expect(createCodeChallenge('dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk')).resolves.toBe(
                'E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM',
            );
        });
    });

    describe('getSignInUrl', () => {
        it('keeps the implicit flow by default', async () => {
            delete mutableConfig.authFlow;

            const result = await getSignInUrl({ nextUrl: '/x' });

            expect(isSuccess(result)).toBe(true);
            if (isSuccess(result)) {
                const url = new URL(result.data);
                expect(url.searchParams.get('response_type')).toBe('token');
                expect(url.searchParams.get('code_challenge')).toBeNull();
                expect(sessionStorage.getItem('pkce_code_verifier')).toBeNull();
            }
        });

        it('sends code, S256 challenge and redirect uri, and keeps the verifier for the redirect', async () => {
            const result = await getSignInUrl({ nextUrl: '/patients' });

            expect(isSuccess(result)).toBe(true);
            if (!isSuccess(result)) {
                return;
            }
            const url = new URL(result.data);
            const verifier = sessionStorage.getItem('pkce_code_verifier')!;

            expect(url.searchParams.get('response_type')).toBe('code');
            expect(url.searchParams.get('client_id')).toBe(config.clientId);
            expect(url.searchParams.get('redirect_uri')).toBe('http://localhost:3000/auth');
            expect(url.searchParams.get('code_challenge_method')).toBe('S256');
            expect(url.searchParams.get('code_challenge')).toBe(await createCodeChallenge(verifier));
            expect(parseOAuthState(url.searchParams.get('state') ?? undefined)).toEqual({ nextUrl: '/patients' });
        });

        it.each(['authTokenPath', 'authClientRedirectURL'])('fails without %s and stores no verifier', async (key) => {
            delete mutableConfig[key];

            const result = await getSignInUrl();

            expect(isFailure(result)).toBe(true);
            expect(sessionStorage.getItem('pkce_code_verifier')).toBeNull();
        });
    });

    describe('exchangeAuthorizationCodeForToken', () => {
        it('sends the verifier and discards it after success', async () => {
            sessionStorage.setItem('pkce_code_verifier', 'the-verifier');
            const fetchMock = vi
                .spyOn(globalThis, 'fetch')
                .mockResolvedValue(new Response(JSON.stringify({ access_token: 'a' }), { status: 200 }));

            const result = await exchangeAuthorizationCodeForToken('the-code');

            expect(isSuccess(result)).toBe(true);
            const body = new URLSearchParams(fetchMock.mock.calls[0]![1]!.body as URLSearchParams);
            expect(body.get('code_verifier')).toBe('the-verifier');
            expect(body.get('code')).toBe('the-code');
            expect(body.get('grant_type')).toBe('authorization_code');
            expect(body.get('redirect_uri')).toBe('http://localhost:3000/auth');
            expect(sessionStorage.getItem('pkce_code_verifier')).toBeNull();
        });

        it('discards the verifier after a failed exchange', async () => {
            sessionStorage.setItem('pkce_code_verifier', 'the-verifier');
            vi.spyOn(globalThis, 'fetch').mockResolvedValue(
                new Response(JSON.stringify({ error: 'invalid_grant' }), { status: 400 }),
            );

            const result = await exchangeAuthorizationCodeForToken('the-code');

            expect(isFailure(result)).toBe(true);
            expect(sessionStorage.getItem('pkce_code_verifier')).toBeNull();
        });

        it('fails without a verifier and does not call the token endpoint', async () => {
            const fetchMock = vi.spyOn(globalThis, 'fetch');

            const result = await exchangeAuthorizationCodeForToken('the-code');

            expect(isFailure(result)).toBe(true);
            expect(fetchMock).not.toHaveBeenCalled();
        });

        it('sends no verifier in implicit mode', async () => {
            delete mutableConfig.authFlow;
            const fetchMock = vi
                .spyOn(globalThis, 'fetch')
                .mockResolvedValue(new Response(JSON.stringify({ access_token: 'a' }), { status: 200 }));

            await exchangeAuthorizationCodeForToken('the-code');

            const body = new URLSearchParams(fetchMock.mock.calls[0]![1]!.body as URLSearchParams);
            expect(body.has('code_verifier')).toBe(false);
        });
    });
});
