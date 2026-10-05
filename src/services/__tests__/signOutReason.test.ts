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

describe('expired sign-out reason', () => {
    beforeEach(() => {
        installFakeLocalStorage();
    });

    it('is absent when no Expired Sign-Out happened', () => {
        expect(getSignOutReason()).toBeUndefined();
    });

    it('stays readable by every tab and is cleared by the next sign-in', () => {
        window.localStorage.setItem('signout_reason', 'expired');

        expect(getSignOutReason()).toBe('expired');
        expect(getSignOutReason()).toBe('expired');

        setToken('new-token');

        expect(getSignOutReason()).toBeUndefined();
    });
});
