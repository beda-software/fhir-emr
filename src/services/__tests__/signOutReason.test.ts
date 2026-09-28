import { beforeEach, describe, expect, it } from 'vitest';

import { getSignOutReason, setToken } from 'src/services/auth';

// setupTests.ts stubs window.localStorage with no-op vi.fn()s; these tests need a
// real read-your-writes localStorage.
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

describe('sign-out reason', () => {
    beforeEach(() => {
        installFakeLocalStorage();
    });

    it('is absent when no Forced Sign-Out happened', () => {
        expect(getSignOutReason()).toBeUndefined();
    });

    it('stays readable by every tab redirected by the same Forced Sign-Out', () => {
        window.localStorage.setItem('signout_reason', 'forced');

        expect(getSignOutReason()).toBe('forced');
        expect(getSignOutReason()).toBe('forced');
    });

    it('is cleared by the next sign-in', () => {
        window.localStorage.setItem('signout_reason', 'forced');

        setToken('new-token');

        expect(getSignOutReason()).toBeUndefined();
    });
});
