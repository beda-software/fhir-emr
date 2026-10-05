import { renderHook } from '@testing-library/react';
import { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { doLogout } from 'src/services/auth';

import { useIdleTimeout } from '../hooks';
import { IDLE_TIMEOUT_CONFIG, LAST_PROVIDER_ACTIVITY_STORAGE_KEY } from '../utils';

// Deliberately far from the 30-minute / 2-minute defaults, so a hook that ignores
// this config would still report 'active' at the elapsed times used below.
// (Inlined rather than shared via a const: vi.mock's factory is hoisted above
// top-level declarations, so it can't close over one.)
vi.mock('@beda.software/emr-config', () => ({
    default: { idleTimeoutMs: 10_000, warningWindowBeforeIdleTimeoutMs: 4_000 },
}));

const IDLE_TIMEOUT_MS = 10_000;
const WARNING_WINDOW_MS = 4_000;
const WARNING_START_MS = IDLE_TIMEOUT_MS - WARNING_WINDOW_MS;

vi.mock('src/services/auth', () => ({
    doLogout: vi.fn().mockResolvedValue(undefined),
    getToken: () => window.localStorage.getItem('token') || undefined,
}));

function requireConfig() {
    if (!IDLE_TIMEOUT_CONFIG) {
        throw new Error('Expected the mocked deployment config to enable the Idle Timeout');
    }

    return IDLE_TIMEOUT_CONFIG;
}

function wrapper({ children }: { children: ReactNode }) {
    return <MemoryRouter>{children}</MemoryRouter>;
}

// setupTests.ts stubs window.localStorage with no-op vi.fn()s; this suite needs a
// real read-your-writes localStorage to seed the persisted last-Provider-Activity time.
function installFakeLocalStorage() {
    const store = new Map<string, string>();
    Object.defineProperty(window, 'localStorage', {
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

describe('useIdleTimeout reading configured durations from deployment config', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        installFakeLocalStorage();
        vi.mocked(doLogout).mockClear();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('shows the Warning Window at the configured Idle Timeout minus the configured Warning Window, not the 2-minute default', () => {
        const t0 = 1_700_000_000_000;
        window.localStorage.setItem(LAST_PROVIDER_ACTIVITY_STORAGE_KEY, String(t0 - WARNING_START_MS));
        vi.setSystemTime(t0);

        const { result } = renderHook(() => useIdleTimeout(requireConfig()), { wrapper });

        expect(result.current.state).toBe('warning');
        expect(doLogout).not.toHaveBeenCalled();
    });

    it('performs the Forced Sign-Out at the configured Idle Timeout, not the 30-minute default', () => {
        const t0 = 1_700_000_000_000;
        window.localStorage.setItem(LAST_PROVIDER_ACTIVITY_STORAGE_KEY, String(t0 - IDLE_TIMEOUT_MS));
        window.localStorage.setItem('token', 'still-here');
        vi.setSystemTime(t0);

        const { result } = renderHook(() => useIdleTimeout(requireConfig()), { wrapper });

        expect(result.current.state).toBe('expired');
        expect(doLogout).toHaveBeenCalledWith('forced');
    });

    it('still shows the Warning Window just before the configured Idle Timeout, confirming the shorter durations rather than the defaults are in effect', () => {
        const t0 = 1_700_000_000_000;
        window.localStorage.setItem(LAST_PROVIDER_ACTIVITY_STORAGE_KEY, String(t0 - (WARNING_START_MS - 1)));
        vi.setSystemTime(t0);

        const { result } = renderHook(() => useIdleTimeout(requireConfig()), { wrapper });

        expect(result.current.state).toBe('active');
    });
});
