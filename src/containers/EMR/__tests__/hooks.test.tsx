import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import config from '@beda.software/emr-config';

import { isIdleTimeoutElapsedNow } from 'src/components/IdleTimeout/utils';
import { doLogout, getToken, refreshSession } from 'src/services/auth';
import { axiosInstance } from 'src/services/fhir';
import { installSessionRejectionInterceptor } from 'src/services/sessionRejection';

import { useSessionRejectionInterceptor } from '../hooks';

// axios keeps ejected interceptors as null slots.
function activeResponseInterceptors() {
    const { handlers } = axiosInstance.interceptors.response as unknown as { handlers: unknown[] };

    return handlers.filter(Boolean).length;
}

describe('useSessionRejectionInterceptor', () => {
    it('is active only while it is mounted', () => {
        const before = activeResponseInterceptors();

        const mounted = renderHook(() => useSessionRejectionInterceptor());
        expect(activeResponseInterceptors()).toBe(before + 1);

        mounted.unmount();
        expect(activeResponseInterceptors()).toBe(before);
    });

    it('does not stack a second copy across remounts', () => {
        const before = activeResponseInterceptors();

        renderHook(() => useSessionRejectionInterceptor()).unmount();
        const remounted = renderHook(() => useSessionRejectionInterceptor());

        expect(activeResponseInterceptors()).toBe(before + 1);
        remounted.unmount();
    });

    it('reuses an interceptor the app installed before EMR mounted', () => {
        const before = activeResponseInterceptors();
        const releaseApp = installSessionRejectionInterceptor(axiosInstance, {
            baseURL: config.baseURL,
            getToken,
            isIdleTimeoutElapsed: isIdleTimeoutElapsedNow,
            endSession: doLogout,
            refreshSession,
        });

        const mounted = renderHook(() => useSessionRejectionInterceptor());
        expect(activeResponseInterceptors()).toBe(before + 1);

        mounted.unmount();
        expect(activeResponseInterceptors()).toBe(before + 1);

        const remounted = renderHook(() => useSessionRejectionInterceptor());
        expect(activeResponseInterceptors()).toBe(before + 1);

        remounted.unmount();
        releaseApp();
        expect(activeResponseInterceptors()).toBe(before);
    });
});
