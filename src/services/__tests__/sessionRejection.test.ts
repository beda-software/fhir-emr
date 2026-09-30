import axios, { AxiosError } from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { installSessionRejectionInterceptor } from 'src/services/sessionRejection';

const BASE_URL = 'https://aidbox.test';

interface Setup {
    token?: string;
    idleElapsed?: boolean;
}

function setup({ token = 'live', idleElapsed = false }: Setup = {}) {
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
    });

    return {
        instance,
        endSession,
        respond,
        eject,
        clearToken: () => (currentToken = undefined),
    };
}

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
});
