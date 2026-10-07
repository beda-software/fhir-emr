import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';

import config from '@beda.software/emr-config';

import { SignIn } from 'src/containers/SignIn';
import { formatOAuthState, getToken, parseOAuthState } from 'src/services/auth';
import { saveCodeVerifier } from 'src/services/pkce';
import { ThemeProvider } from 'src/theme';

import { EMR } from '../index';

vi.mock('react-router-dom', () => vi.importActual('react-router-dom'));
vi.mock('src/components/BaseLayout/Footer', () => ({ AppFooter: () => null }));

function installFakeStorage(name: 'localStorage' | 'sessionStorage') {
    const store = new Map<string, string>();
    Object.defineProperty(window, name, {
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

function renderEMRAt(url: string, anonymousRoutes?: React.ReactElement) {
    window.history.pushState({}, '', url);

    return render(
        <ThemeProvider>
            <EMR menuLayout={() => []} anonymousRoutes={anonymousRoutes} />
        </ThemeProvider>,
    );
}

describe('EMR auth callback route', () => {
    const originalLocation = window.location;
    let redirects: string[];
    let fetchMock: MockInstance | undefined;

    beforeEach(() => {
        redirects = [];
        fetchMock = undefined;
        installFakeStorage('localStorage');
        installFakeStorage('sessionStorage');
        // jsdom cannot navigate, so capture full-page redirects while the router keeps reading the real URL
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: new Proxy(originalLocation, {
                get: (target, prop) => {
                    const value = Reflect.get(target, prop, target);

                    return typeof value === 'function' ? value.bind(target) : value;
                },
                set: (target, prop, value) => {
                    if (prop === 'href') {
                        redirects.push(value);

                        return true;
                    }

                    return Reflect.set(target, prop, value, target);
                },
            }),
        });
    });

    afterEach(() => {
        Object.defineProperty(window, 'location', { configurable: true, value: originalLocation });
        delete mutableConfig.authFlow;
        delete mutableConfig.authTokenPath;
        delete mutableConfig.authClientRedirectURL;
        fetchMock?.mockRestore();
    });

    function useCodeFlow() {
        mutableConfig.authFlow = 'code';
        mutableConfig.authTokenPath = 'auth/token';
        mutableConfig.authClientRedirectURL = 'http://localhost:3000/auth';
    }

    const nextUrlState = encodeURIComponent(formatOAuthState({ nextUrl: '/patients' }));

    it('keeps the implicit flow when no flow is configured', async () => {
        renderEMRAt(`/auth#access_token=implicit-token&state=${nextUrlState}`);

        await waitFor(() => expect(redirects).toEqual(['/patients']));
        expect(getToken()).toBe('implicit-token');
    });

    it('completes sign-in with the authorization code when the code flow is configured', async () => {
        useCodeFlow();
        saveCodeVerifier('verifier');
        fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response(JSON.stringify({ access_token: 'code-token', refresh_token: 'refresh' }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }),
        );

        renderEMRAt(`/auth?code=abc&state=${nextUrlState}`);

        await waitFor(() => expect(redirects).toEqual(['/patients']));
        expect(getToken()).toBe('code-token');
        const body = fetchMock!.mock.calls[0]![1]!.body as URLSearchParams;
        expect(body.get('code')).toBe('abc');
        expect(body.get('code_verifier')).toBe('verifier');
    });

    it('redirects to the root when the code flow state carries no next URL', async () => {
        useCodeFlow();
        saveCodeVerifier('verifier');
        fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response(JSON.stringify({ access_token: 'code-token' }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }),
        );

        renderEMRAt('/auth?code=abc');

        await waitFor(() => expect(redirects).toEqual(['/']));
    });

    it('lets a consumer-declared callback route win over the built-in one', async () => {
        useCodeFlow();

        renderEMRAt('/auth?code=abc', <Route path="/auth" element={<div>custom callback</div>} />);

        expect(await screen.findByText('custom callback')).toBeInTheDocument();
        expect(redirects).toEqual([]);
    });

    describe('when the code exchange fails', () => {
        const signInRoute = <Route path="/signin" element={<SignIn />} />;
        const failureMessage = 'Sign-in did not complete. Please try again.';

        it('returns to the sign-in screen with a generic message, hiding the provider error', async () => {
            useCodeFlow();
            saveCodeVerifier('verifier');
            fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
                new Response(JSON.stringify({ error_description: 'secret provider detail' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                }),
            );

            renderEMRAt(`/auth?code=abc&state=${nextUrlState}`, signInRoute);

            expect(await screen.findByText(failureMessage)).toBeInTheDocument();
            expect(window.location.pathname).toBe('/signin');
            expect(screen.queryByText(/secret provider detail/)).not.toBeInTheDocument();
            expect(getToken()).toBeUndefined();
        });

        it('shows the same message when the PKCE verifier is missing', async () => {
            useCodeFlow();

            renderEMRAt(`/auth?code=abc&state=${nextUrlState}`, signInRoute);

            expect(await screen.findByText(failureMessage)).toBeInTheDocument();
            expect(window.location.pathname).toBe('/signin');
        });

        it('sends the provider back to the requested page on retry', async () => {
            useCodeFlow();

            renderEMRAt(`/auth?code=abc&state=${nextUrlState}`, signInRoute);
            await screen.findByText(failureMessage);
            await userEvent.click(screen.getByRole('button', { name: 'Log in' }));

            await waitFor(() => expect(redirects).toHaveLength(1));
            const state = new URL(redirects[0]!).searchParams.get('state');
            expect(parseOAuthState(state ?? undefined).nextUrl).toBe('/patients');
        });
    });
});
