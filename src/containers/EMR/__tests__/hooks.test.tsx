import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { axiosInstance } from 'src/services/fhir';

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
});
