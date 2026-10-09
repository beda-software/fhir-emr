import { render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { installFakeLocalStorage } from 'src/services/__tests__/fakeLocalStorage';

import { IdleTimeout } from '../index';
import { LAST_PROVIDER_ACTIVITY_STORAGE_KEY, isIdleTimeoutElapsedNow } from '../utils';

vi.mock('src/services/auth', () => ({
    doLogout: vi.fn().mockResolvedValue(undefined),
    getToken: () => window.localStorage.getItem('token') || undefined,
}));

const T0 = 1_700_000_000_000;
const IDLE_TIMEOUT_SECONDS = 60;

describe('mounting IdleTimeout', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(T0);
        installFakeLocalStorage();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('renders nothing and starts nothing without a token', () => {
        const { container } = render(<IdleTimeout idleTimeoutSeconds={IDLE_TIMEOUT_SECONDS} />);

        expect(container).toBeEmptyDOMElement();
        expect(window.localStorage.getItem(LAST_PROVIDER_ACTIVITY_STORAGE_KEY)).toBeNull();
    });

    it('runs with a token and no router around it', () => {
        window.localStorage.setItem('token', 'live');

        render(<IdleTimeout idleTimeoutSeconds={IDLE_TIMEOUT_SECONDS} />);

        expect(window.localStorage.getItem(LAST_PROVIDER_ACTIVITY_STORAGE_KEY)).toBe(String(T0));
    });

    it('throws for an invalid idleTimeoutSeconds, with or without a token', () => {
        vi.spyOn(console, 'error').mockImplementation(() => undefined);

        expect(() => render(<IdleTimeout idleTimeoutSeconds={0} />)).toThrow(/idleTimeoutSeconds/);
    });
});

describe('isIdleTimeoutElapsedNow', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(T0);
        installFakeLocalStorage();
        window.localStorage.setItem(LAST_PROVIDER_ACTIVITY_STORAGE_KEY, String(T0 - IDLE_TIMEOUT_SECONDS * 1000));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('is false while no IdleTimeout is mounted, however old the stored timestamp', () => {
        expect(isIdleTimeoutElapsedNow()).toBe(false);
    });

    it('uses the mounted durations, and is false again once unmounted', () => {
        window.localStorage.setItem('token', 'live');
        const { unmount } = render(<IdleTimeout idleTimeoutSeconds={IDLE_TIMEOUT_SECONDS} />);

        expect(isIdleTimeoutElapsedNow()).toBe(true);

        unmount();

        expect(isIdleTimeoutElapsedNow()).toBe(false);
    });

    it('is false while a mounted IdleTimeout has a longer timeout than the stored timestamp is old', () => {
        window.localStorage.setItem('token', 'live');
        const { unmount } = render(<IdleTimeout idleTimeoutSeconds={IDLE_TIMEOUT_SECONDS * 2} />);

        expect(isIdleTimeoutElapsedNow()).toBe(false);

        unmount();
    });
});
