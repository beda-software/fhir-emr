import { act, renderHook } from '@testing-library/react';
import { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { doLogout } from 'src/services/auth';

import { useIdleSessionTimeout } from '../hooks';
import { LAST_ACTIVITY_STORAGE_KEY, STATE_BROADCAST_STORAGE_KEY } from '../multiTabSync';

vi.mock('src/services/auth', () => ({
    doLogout: vi.fn().mockResolvedValue(undefined),
    getToken: () => window.localStorage.getItem('token') || undefined,
}));

const IDLE_TIMEOUT_MS = 30 * 60 * 1000;
const WARNING_WINDOW_MS = 2 * 60 * 1000;
const WARNING_START_MS = IDLE_TIMEOUT_MS - WARNING_WINDOW_MS;

function wrapper({ children }: { children: ReactNode }) {
    return <MemoryRouter>{children}</MemoryRouter>;
}

function dispatchStorageEvent(key: string | null, newValue: string | null) {
    act(() => {
        window.dispatchEvent(new StorageEvent('storage', { key, newValue }));
    });
}

// setupTests.ts stubs window.localStorage with no-op vi.fn()s; this suite needs a
// real read-your-writes localStorage to observe cross-tab sync.
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

describe('useIdleSessionTimeout multi-tab coordination', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        installFakeLocalStorage();
        vi.mocked(doLogout).mockClear();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('a remote Provider Activity signal resets the countdown displayed in this tab, without re-persisting it', () => {
        const t0 = 1_700_000_000_000;
        vi.setSystemTime(t0);
        window.localStorage.setItem(LAST_ACTIVITY_STORAGE_KEY, String(t0));

        const { result } = renderHook(() => useIdleSessionTimeout(), { wrapper });
        expect(result.current.state).toBe('active');

        vi.setSystemTime(t0 + WARNING_START_MS + 1000);
        const remoteActivityAt = t0 + WARNING_START_MS + 1000;
        dispatchStorageEvent(LAST_ACTIVITY_STORAGE_KEY, String(remoteActivityAt));

        expect(result.current.state).toBe('active');
        // This tab must not re-broadcast what it only learned about remotely.
        expect(window.localStorage.getItem(LAST_ACTIVITY_STORAGE_KEY)).toBe(String(t0));
    });

    it('a remote state-broadcast signal shows the Warning Window in this tab ahead of its own recheck interval', () => {
        const t0 = 1_700_000_000_000;
        vi.setSystemTime(t0);
        window.localStorage.setItem(LAST_ACTIVITY_STORAGE_KEY, String(t0));

        const { result } = renderHook(() => useIdleSessionTimeout(), { wrapper });
        expect(result.current.state).toBe('active');

        // No local recheck has run yet (fake timers never advanced), so only the
        // remote broadcast can be responsible for the transition below.
        vi.setSystemTime(t0 + WARNING_START_MS + 1000);
        dispatchStorageEvent(STATE_BROADCAST_STORAGE_KEY, String(Date.now()));

        expect(result.current.state).toBe('warning');
        expect(doLogout).not.toHaveBeenCalled();
    });

    it('a remote state-broadcast signal reaching expiry updates the display but does not itself trigger Forced Sign-Out', () => {
        const t0 = 1_700_000_000_000;
        vi.setSystemTime(t0);
        window.localStorage.setItem(LAST_ACTIVITY_STORAGE_KEY, String(t0));

        const { result } = renderHook(() => useIdleSessionTimeout(), { wrapper });

        vi.setSystemTime(t0 + IDLE_TIMEOUT_MS + 1000);
        dispatchStorageEvent(STATE_BROADCAST_STORAGE_KEY, String(Date.now()));

        expect(result.current.state).toBe('expired');
        // Forced Sign-Out is only ever driven by this tab's own local evaluation
        // (its recheck interval or a focus/visibility regain), never by a remote signal.
        expect(doLogout).not.toHaveBeenCalled();
    });

    it('a sessionEnded signal (another tab clearing localStorage via doLogout) redirects this tab to the sign-in screen', () => {
        const t0 = 1_700_000_000_000;
        vi.setSystemTime(t0);
        window.localStorage.setItem(LAST_ACTIVITY_STORAGE_KEY, String(t0));

        renderHook(() => useIdleSessionTimeout(), { wrapper });

        const hrefSpy = vi.fn();
        // jsdom's Location#href is a non-configurable accessor; replace `window.location`
        // itself with a minimal stub so the `sessionEnded` handler's redirect is observable.
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: {
                get href() {
                    return '';
                },
                set href(value: string) {
                    hrefSpy(value);
                },
            },
        });

        // Mirrors what doLogout() does in the tab that actually ended the Session.
        window.localStorage.clear();
        act(() => {
            window.dispatchEvent(new StorageEvent('storage', { key: null, newValue: null }));
        });

        expect(hrefSpy).toHaveBeenCalledWith('/');
        // This tab follows the already-ended Session; it does not call doLogout again.
        expect(doLogout).not.toHaveBeenCalled();
    });

    it('a local recheck that finds the Session already expired calls doLogout when a token is still present', async () => {
        const t0 = 1_700_000_000_000;
        window.localStorage.setItem(LAST_ACTIVITY_STORAGE_KEY, String(t0 - IDLE_TIMEOUT_MS));
        window.localStorage.setItem('token', 'still-here');
        vi.setSystemTime(t0);

        await act(async () => {
            renderHook(() => useIdleSessionTimeout(), { wrapper });
            // The Forced Sign-Out effect is fired from inside an async IIFE; let its
            // microtask chain (best-effort Draft flush, then doLogout) run.
            await Promise.resolve();
            await Promise.resolve();
        });

        expect(doLogout).toHaveBeenCalledWith('idle');
    });

    it('skips its own doLogout when another tab already cleared the token first (avoids a redundant concurrent Forced Sign-Out)', () => {
        const t0 = 1_700_000_000_000;
        window.localStorage.setItem(LAST_ACTIVITY_STORAGE_KEY, String(t0 - IDLE_TIMEOUT_MS));
        vi.setSystemTime(t0);

        const { result } = renderHook(() => useIdleSessionTimeout(), { wrapper });

        expect(result.current.state).toBe('expired');
        expect(doLogout).not.toHaveBeenCalled();
    });
});
