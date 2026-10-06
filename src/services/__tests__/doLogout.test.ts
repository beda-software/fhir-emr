import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('src/services/fhir', () => ({
    aidboxService: vi.fn(),
    resetInstanceToken: vi.fn(),
    setInstanceToken: vi.fn(),
}));

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

// setupTests.ts has already loaded the real auth module, so re-import it against the mock.
let doLogout: typeof import('src/services/auth').doLogout;
let aidboxService: typeof import('src/services/fhir').aidboxService;
let resetInstanceToken: typeof import('src/services/fhir').resetInstanceToken;

describe('doLogout', () => {
    const originalLocation = window.location;

    beforeEach(async () => {
        vi.resetModules();
        ({ doLogout } = await import('src/services/auth'));
        ({ aidboxService, resetInstanceToken } = await import('src/services/fhir'));
        installFakeLocalStorage();
        vi.mocked(aidboxService)
            .mockReset()
            .mockResolvedValue(undefined as never);
        vi.mocked(resetInstanceToken).mockClear();
        Object.defineProperty(window, 'location', {
            configurable: true,
            writable: true,
            value: { href: '/x', reload: vi.fn() },
        });
        vi.spyOn(window.history, 'replaceState');
    });

    afterEach(() => {
        vi.restoreAllMocks();
        Object.defineProperty(window, 'location', { configurable: true, value: originalLocation });
    });

    it('revokes the Session, clears storage and reloads onto the sign-in route carrying the reason', async () => {
        window.localStorage.setItem('token', 't');

        await doLogout('expired');

        expect(aidboxService).toHaveBeenCalledWith(expect.objectContaining({ method: 'DELETE', url: '/Session' }));
        expect(window.localStorage.getItem('token')).toBeNull();
        expect(window.history.replaceState).toHaveBeenCalledWith({ usr: { signOutReason: 'expired' } }, '', '/signin');
        expect(window.location.reload).toHaveBeenCalled();
    });

    it('carries no sign-out reason for a Manual Sign-Out', async () => {
        window.localStorage.setItem('token', 't');

        await doLogout('manual');

        expect(window.localStorage.getItem('token')).toBeNull();
        expect(window.history.replaceState).not.toHaveBeenCalled();
        expect(window.location.href).toBe('/');
    });

    it('ends the Session exactly once when invoked concurrently', async () => {
        await Promise.all([doLogout('expired'), doLogout('expired'), doLogout('manual')]);

        expect(aidboxService).toHaveBeenCalledTimes(1);
        expect(resetInstanceToken).toHaveBeenCalledTimes(1);
    });

    it('still clears state and reloads with the reason when revocation fails', async () => {
        vi.mocked(aidboxService).mockRejectedValue(new Error('401'));
        window.localStorage.setItem('token', 't');

        await doLogout('expired');

        expect(window.localStorage.getItem('token')).toBeNull();
        expect(window.history.replaceState).toHaveBeenCalledWith({ usr: { signOutReason: 'expired' } }, '', '/signin');
        expect(window.location.reload).toHaveBeenCalled();
    });
});
