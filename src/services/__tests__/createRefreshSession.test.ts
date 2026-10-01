import axios, { AxiosError } from 'axios';
import type { AxiosInstance } from 'axios';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { createRefreshSession } from 'src/services/auth';
import { installSessionRejectionInterceptor } from 'src/services/sessionRejection';

function build(refreshToken: string | undefined) {
    const saveAccessToken = vi.fn();
    const refresh = createRefreshSession({
        getRefreshToken: () => refreshToken,
        saveAccessToken,
        clientId: 'mobile',
        baseURL: 'https://emr.test',
    });

    return { refresh, saveAccessToken };
}

describe('createRefreshSession', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('does nothing without a refresh credential', async () => {
        const post = vi.spyOn(axios, 'post');
        const { refresh, saveAccessToken } = build(undefined);

        await expect(refresh()).resolves.toBeUndefined();

        expect(post).not.toHaveBeenCalled();
        expect(saveAccessToken).not.toHaveBeenCalled();
    });

    it('refreshes against the injected Client and base URL and saves the new access token', async () => {
        const post = vi.spyOn(axios, 'post').mockResolvedValue({ data: { access_token: 'new' } });
        const { refresh, saveAccessToken } = build('refresh');

        await expect(refresh()).resolves.toBe('new');

        expect(post).toHaveBeenCalledWith('https://emr.test/auth/token', {
            grant_type: 'refresh_token',
            client_id: 'mobile',
            refresh_token: 'refresh',
        });
        expect(saveAccessToken).toHaveBeenCalledWith('new');
    });

    it('rejects when the server rejects the refresh', async () => {
        vi.spyOn(axios, 'post').mockRejectedValue(new Error('Invalid refresh_token'));
        const { refresh, saveAccessToken } = build('refresh');

        await expect(refresh()).rejects.toThrow();

        expect(saveAccessToken).not.toHaveBeenCalled();
    });

    it('lets the 401 handling refresh and replay a rejected request on a plain HTTP client', async () => {
        vi.spyOn(axios, 'post').mockResolvedValue({ data: { access_token: 'new' } });
        let token: string | undefined = 'old';
        const refresh = createRefreshSession({
            getRefreshToken: () => 'refresh',
            saveAccessToken: (t) => {
                token = t;
            },
            clientId: 'mobile',
            baseURL: 'https://emr.test',
        });
        const client: AxiosInstance = axios.create({
            baseURL: 'https://emr.test',
            adapter: async (config) => {
                const ok = config.headers.get('Authorization') === 'Bearer new';
                const response = { data: {}, status: ok ? 200 : 401, statusText: '', headers: {}, config };
                if (ok) {
                    return response;
                }
                throw new AxiosError('Unauthorized', '401', config, undefined, response);
            },
        });
        const endSession = vi.fn();
        installSessionRejectionInterceptor(client, {
            baseURL: 'https://emr.test',
            getToken: () => token,
            isIdleTimeoutElapsed: () => false,
            endSession,
            refreshSession: refresh,
        });

        const response = await client.get('/Patient', { headers: { Authorization: 'Bearer old' } });

        expect(response.status).toBe(200);
        expect(endSession).not.toHaveBeenCalled();
    });
});
