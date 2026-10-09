import axios, { AxiosError } from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';

import { installSessionRejectionInterceptor, type SessionRejectionDeps } from 'src/services/sessionRejection';

const BASE_URL = 'https://aidbox.test';

interface Setup {
    token?: string;
    idleElapsed?: boolean;
    refreshSession?: () => Promise<string | undefined>;
}

function setup({ token = 'live', idleElapsed = false, refreshSession = async () => undefined }: Setup = {}) {
    const endSession = vi.fn();
    let currentToken: string | undefined = token;
    const respond = vi.fn<[InternalAxiosRequestConfig], { status: number; data?: unknown }>();
    const instance: AxiosInstance = axios.create({
        baseURL: BASE_URL,
        adapter: async (config) => {
            const { status, data } = respond(config);
            const response = { status, data, statusText: '', headers: {}, config };
            if (status >= 200 && status < 300) {
                return response;
            }
            throw new AxiosError('failed', 'ERR_BAD_REQUEST', config, {}, response);
        },
    });
    const eject = installSessionRejectionInterceptor(instance, {
        baseURL: BASE_URL,
        getToken: () => currentToken,
        isIdleTimeoutElapsed: () => idleElapsed,
        endSession,
        refreshSession: async () => {
            const next = await refreshSession();
            currentToken = next ?? currentToken;

            return next;
        },
    });

    return {
        instance,
        endSession,
        respond,
        eject,
        clearToken: () => (currentToken = undefined),
    };
}

const refreshFailedWith = (status?: number) =>
    new AxiosError('refresh failed', undefined, undefined, undefined, status ? ({ status } as never) : undefined);

const bearer = (token: string) => ({ Authorization: `Bearer ${token}` });

describe('session rejection interceptor', () => {
    let t: ReturnType<typeof setup>;

    beforeEach(() => {
        t = setup();
        t.respond.mockReturnValue({ status: 401, data: { resourceType: 'OperationOutcome' } });
    });

    it('ends the Session as expired on a 401 for the current Bearer token', async () => {
        await expect(t.instance.get('/Patient', { headers: bearer('live') })).rejects.toMatchObject({
            response: { status: 401, data: { resourceType: 'OperationOutcome' } },
        });

        expect(t.endSession).toHaveBeenCalledTimes(1);
        expect(t.endSession).toHaveBeenCalledWith('expired');
    });

    it('ends as forced instead when the Idle Timeout has already elapsed', async () => {
        t = setup({ idleElapsed: true });
        t.respond.mockReturnValue({ status: 401 });

        await expect(t.instance.get('/Patient', { headers: bearer('live') })).rejects.toBeDefined();

        expect(t.endSession).toHaveBeenCalledWith('forced');
    });

    it('hands several concurrent 401s to the end-of-session action, which collapses them', async () => {
        await Promise.allSettled([
            t.instance.get('/Patient', { headers: bearer('live') }),
            t.instance.get('/Encounter', { headers: bearer('live') }),
        ]);

        expect(t.endSession).toHaveBeenCalledTimes(2);
        expect(t.endSession).toHaveBeenNthCalledWith(1, 'expired');
        expect(t.endSession).toHaveBeenNthCalledWith(2, 'expired');
    });

    describe.each([
        ['a different Bearer token', '/Patient', { headers: bearer('other') }],
        ['an empty Bearer', '/Patient', { headers: { Authorization: 'Bearer ' } }],
        ['Basic auth', '/Patient', { headers: { Authorization: 'Basic abc' } }],
        ['no Authorization', '/Patient', {}],
        ['a token request', '/auth/token', { headers: bearer('live') }],
        ['a Session call', '/Session', { headers: bearer('live'), method: 'DELETE' }],
        ['another origin', 'https://smart.example/api', { headers: bearer('live') }],
    ])('passes a 401 through untouched for %s', (_name, url, config) => {
        it('rejects the caller without ending the Session', async () => {
            await expect(t.instance.request({ url, ...config })).rejects.toMatchObject({ response: { status: 401 } });

            expect(t.endSession).not.toHaveBeenCalled();
        });
    });

    it('passes a 401 through when no token is stored any more', async () => {
        t.clearToken();

        await expect(t.instance.get('/Patient', { headers: bearer('live') })).rejects.toBeDefined();

        expect(t.endSession).not.toHaveBeenCalled();
    });

    it.each([400, 403, 404, 500])('passes a %i through untouched', async (status) => {
        t.respond.mockReturnValue({ status });

        await expect(t.instance.get('/Patient', { headers: bearer('live') })).rejects.toBeDefined();

        expect(t.endSession).not.toHaveBeenCalled();
    });

    it('passes a network error through untouched', async () => {
        const failing = axios.create({
            baseURL: BASE_URL,
            adapter: async (config) => {
                throw new AxiosError('Network Error', 'ERR_NETWORK', config);
            },
        });
        installSessionRejectionInterceptor(failing, {
            baseURL: BASE_URL,
            getToken: () => 'live',
            isIdleTimeoutElapsed: () => false,
            endSession: t.endSession,
            refreshSession: async () => undefined,
        });

        await expect(failing.get('/Patient', { headers: bearer('live') })).rejects.toMatchObject({
            code: 'ERR_NETWORK',
        });

        expect(t.endSession).not.toHaveBeenCalled();
    });

    it('stops reacting once ejected', async () => {
        t.eject();

        await expect(t.instance.get('/Patient', { headers: bearer('live') })).rejects.toBeDefined();

        expect(t.endSession).not.toHaveBeenCalled();
    });

    it('leaves successful responses alone', async () => {
        t.respond.mockReturnValue({ status: 200, data: { ok: true } });

        const response = await t.instance.get('/Patient', { headers: bearer('live') });

        expect(response.data).toEqual({ ok: true });
        expect(t.endSession).not.toHaveBeenCalled();
    });

    describe('Token Refresh', () => {
        const replayingAdapter = (t: ReturnType<typeof setup>, validToken: string) =>
            t.respond.mockImplementation((config) =>
                config.headers.get('Authorization') === `Bearer ${validToken}`
                    ? { status: 200, data: { ok: true } }
                    : { status: 401 },
            );

        it('refreshes and replays the request with the new token, invisibly to the caller', async () => {
            const refreshSession = vi.fn().mockResolvedValue('fresh');
            t = setup({ refreshSession });
            replayingAdapter(t, 'fresh');

            const response = await t.instance.get('/Patient', { headers: bearer('live') });

            expect(response.data).toEqual({ ok: true });
            expect(refreshSession).toHaveBeenCalledTimes(1);
            expect(t.endSession).not.toHaveBeenCalled();
        });

        it('shares one refresh between concurrent 401s, including one that lands after it finished', async () => {
            let finishRefresh!: (token: string) => void;
            const refreshSession = vi.fn(() => new Promise<string>((resolve) => (finishRefresh = resolve)));
            t = setup({ refreshSession });
            replayingAdapter(t, 'fresh');

            const results = Promise.all([
                t.instance.get('/Patient', { headers: bearer('live') }),
                t.instance.get('/Encounter', { headers: bearer('live') }),
            ]);
            await vi.waitFor(() => expect(refreshSession).toHaveBeenCalled());
            finishRefresh('fresh');
            const settled = await results;
            const late = await t.instance.get('/Task', { headers: bearer('live') });

            expect(settled.map((r) => r.data)).toEqual([{ ok: true }, { ok: true }]);
            expect(late.data).toEqual({ ok: true });
            expect(refreshSession).toHaveBeenCalledTimes(1);
        });

        it('does not refresh again when the replayed request is rejected too', async () => {
            const refreshSession = vi.fn().mockResolvedValue('fresh');
            t = setup({ refreshSession });
            t.respond.mockReturnValue({ status: 401 });

            await expect(t.instance.get('/Patient', { headers: bearer('live') })).rejects.toBeDefined();

            expect(refreshSession).toHaveBeenCalledTimes(1);
            expect(t.respond).toHaveBeenCalledTimes(2);
            expect(t.endSession).toHaveBeenCalledWith('expired');
        });

        it.each([
            ['a network failure', () => Promise.reject(refreshFailedWith())],
            ['a server error', () => Promise.reject(refreshFailedWith(503))],
        ])('keeps the Session and rejects the request on %s during refresh', async (_name, refreshSession) => {
            t = setup({ refreshSession });
            t.respond.mockReturnValue({ status: 401 });

            await expect(t.instance.get('/Patient', { headers: bearer('live') })).rejects.toMatchObject({
                response: { status: 401 },
            });

            expect(t.endSession).not.toHaveBeenCalled();
        });

        it.each([
            ['there is no refresh credential', () => Promise.resolve(undefined)],
            ['the refresh token is rejected with 400', () => Promise.reject(refreshFailedWith(400))],
            ['the refresh token is rejected with 401', () => Promise.reject(refreshFailedWith(401))],
        ])('ends as expired when %s', async (_name, refreshSession) => {
            t = setup({ refreshSession });
            t.respond.mockReturnValue({ status: 401 });

            await expect(t.instance.get('/Patient', { headers: bearer('live') })).rejects.toMatchObject({
                response: { status: 401 },
            });

            expect(t.endSession).toHaveBeenCalledWith('expired');
        });

        it('skips the refresh and ends as forced when the Idle Timeout has elapsed', async () => {
            const refreshSession = vi.fn().mockResolvedValue('fresh');
            t = setup({ refreshSession, idleElapsed: true });
            t.respond.mockReturnValue({ status: 401 });

            await expect(t.instance.get('/Patient', { headers: bearer('live') })).rejects.toBeDefined();

            expect(refreshSession).not.toHaveBeenCalled();
            expect(t.endSession).toHaveBeenCalledWith('forced');
        });

        it('allows a later refresh once the previous one has settled', async () => {
            const refreshSession = vi.fn().mockResolvedValueOnce('fresh').mockResolvedValueOnce('fresher');
            t = setup({ refreshSession });
            replayingAdapter(t, 'fresh');
            await t.instance.get('/Patient', { headers: bearer('live') });
            replayingAdapter(t, 'fresher');

            const response = await t.instance.get('/Patient', { headers: bearer('fresh') });

            expect(response.data).toEqual({ ok: true });
            expect(refreshSession).toHaveBeenCalledTimes(2);
        });

        it('ends as forced when the Idle Timeout elapses while the refresh is in flight', async () => {
            let idleElapsed = false;
            const refreshSession = vi.fn(async () => {
                idleElapsed = true;

                return 'fresh';
            });
            const endSession = vi.fn();
            const instance = axios.create({
                baseURL: BASE_URL,
                adapter: async (config) => {
                    throw new AxiosError(
                        'failed',
                        'ERR_BAD_REQUEST',
                        config,
                        {},
                        {
                            status: 401,
                            data: undefined,
                            statusText: '',
                            headers: {},
                            config,
                        },
                    );
                },
            });
            installSessionRejectionInterceptor(instance, {
                baseURL: BASE_URL,
                getToken: () => 'live',
                isIdleTimeoutElapsed: () => idleElapsed,
                endSession,
                refreshSession,
            });

            await expect(instance.get('/Patient', { headers: bearer('live') })).rejects.toBeDefined();

            expect(endSession).toHaveBeenCalledWith('forced');
        });
    });
});

describe('installing the session rejection interceptor more than once', () => {
    type SpiedDeps = SessionRejectionDeps & {
        endSession: Mock;
        refreshSession: Mock<[], Promise<string | undefined>>;
    };

    function createRejectingClient(): AxiosInstance {
        return axios.create({
            baseURL: BASE_URL,
            adapter: async (config) => {
                const response = { status: 401, data: {}, statusText: '', headers: {}, config };
                throw new AxiosError('failed', 'ERR_BAD_REQUEST', config, {}, response);
            },
        });
    }

    function createDeps(refreshSession: () => Promise<string | undefined> = async () => undefined): SpiedDeps {
        return {
            baseURL: BASE_URL,
            getToken: () => 'live',
            isIdleTimeoutElapsed: () => false,
            endSession: vi.fn(),
            refreshSession: vi.fn(refreshSession),
        };
    }

    const requestAsSession = (instance: AxiosInstance): Promise<unknown> =>
        instance.get('/Patient', { headers: bearer('live') }).catch(() => undefined);

    it('handles a 401 once, so a failed refresh is not retried by a second copy', async () => {
        const instance = createRejectingClient();
        const app = createDeps(() => Promise.reject(refreshFailedWith(503)));
        const emr = createDeps(() => Promise.reject(refreshFailedWith(503)));
        installSessionRejectionInterceptor(instance, app);
        installSessionRejectionInterceptor(instance, emr);

        await requestAsSession(instance);
        expect(app.refreshSession).toHaveBeenCalledTimes(1);
        expect(emr.refreshSession).not.toHaveBeenCalled();
        expect(app.endSession).not.toHaveBeenCalled();
    });

    it("keeps the first installer's deps", async () => {
        const instance = createRejectingClient();
        const app = createDeps();
        const emr = createDeps();
        installSessionRejectionInterceptor(instance, app);
        installSessionRejectionInterceptor(instance, emr);

        await requestAsSession(instance);
        expect(app.endSession).toHaveBeenCalledWith('expired');
        expect(emr.endSession).not.toHaveBeenCalled();
    });

    it('stays active until the last installer releases it', async () => {
        const instance = createRejectingClient();
        const app = createDeps();
        const releaseApp = installSessionRejectionInterceptor(instance, app);
        const releaseEmr = installSessionRejectionInterceptor(instance, createDeps());

        releaseEmr();
        await requestAsSession(instance);
        expect(app.endSession).toHaveBeenCalledTimes(1);

        releaseApp();
        await requestAsSession(instance);
        expect(app.endSession).toHaveBeenCalledTimes(1);
    });

    it("does not drop another installer's hold when one release runs twice", async () => {
        const instance = createRejectingClient();
        const app = createDeps();
        installSessionRejectionInterceptor(instance, app);
        const releaseEmr = installSessionRejectionInterceptor(instance, createDeps());

        releaseEmr();
        releaseEmr();
        await requestAsSession(instance);
        expect(app.endSession).toHaveBeenCalledTimes(1);
    });

    it('installs with new deps once every earlier installer has released it', async () => {
        const instance = createRejectingClient();
        const first = createDeps();
        const second = createDeps();
        installSessionRejectionInterceptor(instance, first)();
        installSessionRejectionInterceptor(instance, second);

        await requestAsSession(instance);
        expect(first.endSession).not.toHaveBeenCalled();
        expect(second.endSession).toHaveBeenCalledWith('expired');
    });
});
