import { render, screen, waitFor } from '@testing-library/react';
import axios, { AxiosError, type AxiosAdapter, type InternalAxiosRequestConfig } from 'axios';
import { Route } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';

import { getToken } from 'src/services/auth';
import { axiosInstance } from 'src/services/fhir';
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

const admin = { id: 'u1', role: [{ name: 'admin', links: { organization: { id: 'org1' } } }] };

describe('EMR session restore', () => {
    const originalLocation = window.location;
    const originalAdapter = axiosInstance.defaults.adapter;
    let reloads: number;
    let signInStateAtReload: unknown;
    let requests: { method?: string; path: string; authorization?: string }[];
    let refreshPost: MockInstance;
    let validToken: string | undefined;

    function respond(config: InternalAxiosRequestConfig, status: number, data: unknown = {}) {
        const response = { data, status, statusText: '', headers: {}, config };

        return status < 400
            ? Promise.resolve(response)
            : Promise.reject(new AxiosError('failed', String(status), config, null, response));
    }

    beforeEach(() => {
        reloads = 0;
        signInStateAtReload = undefined;
        requests = [];
        validToken = 'fresh-token';
        installFakeStorage('localStorage');
        installFakeStorage('sessionStorage');
        window.localStorage.setItem('token', 'stale-token');
        window.localStorage.setItem('refresh_token', 'refresh');
        window.history.pushState({}, '', '/patients');
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: new Proxy({} as Location, {
                get: (_target, prop) => {
                    if (prop === 'reload') {
                        return () => {
                            reloads++;
                            signInStateAtReload ??= {
                                path: originalLocation.pathname,
                                state: window.history.state.usr,
                            };
                        };
                    }
                    const value = Reflect.get(originalLocation, prop, originalLocation);

                    return typeof value === 'function' ? value.bind(originalLocation) : value;
                },
            }),
        });

        const adapter: AxiosAdapter = (config) => {
            const authorization = config.headers.get('Authorization') as string | undefined;
            const path = new URL(config.url!, config.baseURL).pathname;
            requests.push({ method: config.method, path, authorization });

            if (path === '/Session') {
                return respond(config, 401);
            }
            if (path === '/auth/userinfo') {
                return authorization === `Bearer ${validToken}` ? respond(config, 200, admin) : respond(config, 401);
            }

            return respond(config, 200, { resourceType: 'Organization', id: 'org1' });
        };
        axiosInstance.defaults.adapter = adapter;
    });

    afterEach(() => {
        Object.defineProperty(window, 'location', { configurable: true, value: originalLocation });
        axiosInstance.defaults.adapter = originalAdapter;
        refreshPost.mockRestore();
    });

    function renderEMR() {
        return render(
            <ThemeProvider>
                <EMR
                    menuLayout={() => [{ label: 'Patients', path: '/patients', icon: null } as never]}
                    authenticatedRoutes={<Route path="/patients" element={<div>authenticated app</div>} />}
                    anonymousRoutes={<Route path="/patients" element={<div>anonymous app</div>} />}
                />
            </ThemeProvider>,
        );
    }

    it('renews a stale token on reload and renders the authenticated app after one refresh', async () => {
        refreshPost = vi.spyOn(axios, 'post').mockResolvedValue({ data: { access_token: 'fresh-token' } });

        renderEMR();

        expect(await screen.findByText('authenticated app')).toBeInTheDocument();
        expect(refreshPost).toHaveBeenCalledTimes(1);
        expect(getToken()).toBe('fresh-token');
        expect(reloads).toBe(0);
    });

    it('ends the Session as expired when the refresh token is rejected', async () => {
        refreshPost = vi
            .spyOn(axios, 'post')
            .mockRejectedValue(new AxiosError('rejected', '400', undefined, null, { status: 400 } as never));

        renderEMR();

        await waitFor(() => expect(reloads).toBeGreaterThan(0));
        expect(signInStateAtReload).toEqual({ path: '/signin', state: { signOutReason: 'expired' } });
        expect(getToken()).toBeUndefined();
        expect(window.localStorage.getItem('refresh_token')).toBeNull();
        expect(requests).toContainEqual(expect.objectContaining({ method: 'delete', path: '/Session' }));
        expect(screen.queryByText('authenticated app')).not.toBeInTheDocument();
    });
});
