import { renderHook } from '@testing-library/react';
import axios, { AxiosError } from 'axios';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { installFakeLocalStorage } from 'src/services/__tests__/fakeLocalStorage';
import { installSessionRejectionInterceptor } from 'src/services/sessionRejection';

import { useIdleTimeout } from '../hooks';
import { TEST_IDLE_TIMEOUT_CONFIG } from './testConfig';
import { LAST_PROVIDER_ACTIVITY_STORAGE_KEY, isIdleTimeoutElapsedNow } from '../utils';

vi.mock('@beda.software/emr-config', () => ({
    default: { idleTimeoutMs: 30 * 60 * 1000, warningWindowBeforeIdleTimeoutMs: 2 * 60 * 1000 },
}));

vi.mock('src/services/auth', () => ({
    doLogout: vi.fn().mockResolvedValue(undefined),
    getToken: () => window.localStorage.getItem('token') || undefined,
}));

const T0 = 1_700_000_000_000;

describe('an untouched Session (no Provider Activity since sign-in)', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(T0);
        installFakeLocalStorage();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('persists the last-Provider-Activity timestamp when the Idle Timeout mounts', () => {
        renderHook(() => useIdleTimeout(TEST_IDLE_TIMEOUT_CONFIG));

        expect(window.localStorage.getItem(LAST_PROVIDER_ACTIVITY_STORAGE_KEY)).toBe(String(T0));
    });

    it('does not overwrite a timestamp already stored, so other tabs activity is respected', () => {
        window.localStorage.setItem(LAST_PROVIDER_ACTIVITY_STORAGE_KEY, String(T0 - 1000));

        renderHook(() => useIdleTimeout(TEST_IDLE_TIMEOUT_CONFIG));

        expect(window.localStorage.getItem(LAST_PROVIDER_ACTIVITY_STORAGE_KEY)).toBe(String(T0 - 1000));
    });

    it('does not restart the idle clock on reload', () => {
        const first = renderHook(() => useIdleTimeout(TEST_IDLE_TIMEOUT_CONFIG));
        first.unmount();

        vi.setSystemTime(T0 + TEST_IDLE_TIMEOUT_CONFIG.idleTimeoutMs + 1000);
        renderHook(() => useIdleTimeout(TEST_IDLE_TIMEOUT_CONFIG));

        expect(window.localStorage.getItem(LAST_PROVIDER_ACTIVITY_STORAGE_KEY)).toBe(String(T0));
    });

    it('ends the Session on a 401 after the Idle Timeout elapsed, without a refresh attempt', async () => {
        window.localStorage.setItem('token', 'live');
        renderHook(() => useIdleTimeout(TEST_IDLE_TIMEOUT_CONFIG));
        vi.setSystemTime(T0 + TEST_IDLE_TIMEOUT_CONFIG.idleTimeoutMs + 1000);

        const endSession = vi.fn();
        const refreshSession = vi.fn();
        const instance = axios.create({
            baseURL: 'https://aidbox.test',
            adapter: async (config) => {
                const response = { status: 401, data: {}, statusText: '', headers: {}, config };
                throw new AxiosError('failed', 'ERR_BAD_REQUEST', config, {}, response);
            },
        });
        installSessionRejectionInterceptor(instance, {
            baseURL: 'https://aidbox.test',
            getToken: () => 'live',
            isIdleTimeoutElapsed: isIdleTimeoutElapsedNow,
            endSession,
            refreshSession,
        });

        await expect(instance.get('/Patient', { headers: { Authorization: 'Bearer live' } })).rejects.toBeDefined();

        expect(refreshSession).not.toHaveBeenCalled();
        expect(endSession).toHaveBeenCalledWith('forced');
    });
});
