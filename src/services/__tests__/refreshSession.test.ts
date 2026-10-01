import axios from 'axios';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import config from '@beda.software/emr-config';

import { LAST_PROVIDER_ACTIVITY_STORAGE_KEY } from 'src/components/IdleTimeout/utils';
import { refreshSession } from 'src/services/auth';

import { installFakeLocalStorage } from './fakeLocalStorage';

describe('refreshSession', () => {
    beforeEach(() => {
        installFakeLocalStorage();
        localStorage.clear();
        localStorage.setItem('token', 'old');
        localStorage.setItem('id_token', 'id');
    });

    afterEach(() => {
        vi.restoreAllMocks();
        localStorage.clear();
    });

    it('does nothing without a refresh credential', async () => {
        const post = vi.spyOn(axios, 'post');

        await expect(refreshSession()).resolves.toBeUndefined();

        expect(post).not.toHaveBeenCalled();
    });

    it('replaces only the access token and leaves activity and other stored values alone', async () => {
        localStorage.setItem('refresh_token', 'refresh');
        const post = vi.spyOn(axios, 'post').mockResolvedValue({ data: { access_token: 'new', expires_in: 4 } });

        await expect(refreshSession()).resolves.toBe('new');

        expect(post).toHaveBeenCalledWith(
            `${config.baseURL}/auth/token`,
            expect.objectContaining({ grant_type: 'refresh_token', refresh_token: 'refresh' }),
        );
        expect(localStorage.getItem('token')).toBe('new');
        expect(localStorage.getItem('refresh_token')).toBe('refresh');
        expect(localStorage.getItem('id_token')).toBe('id');
        expect(localStorage.getItem(LAST_PROVIDER_ACTIVITY_STORAGE_KEY)).toBeNull();
    });

    it('rejects when the server rejects the refresh, keeping the stored token', async () => {
        localStorage.setItem('refresh_token', 'refresh');
        vi.spyOn(axios, 'post').mockRejectedValue(new Error('Invalid refresh_token'));

        await expect(refreshSession()).rejects.toThrow();

        expect(localStorage.getItem('token')).toBe('old');
    });

    it('shares one request between concurrent callers', async () => {
        localStorage.setItem('refresh_token', 'refresh');
        const post = vi.spyOn(axios, 'post').mockResolvedValue({ data: { access_token: 'new' } });

        await expect(Promise.all([refreshSession(), refreshSession()])).resolves.toEqual(['new', 'new']);

        expect(post).toHaveBeenCalledTimes(1);
    });
});
