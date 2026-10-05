import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { IdleTimeout } from '../index';
import { LAST_PROVIDER_ACTIVITY_STORAGE_KEY, isIdleTimeoutElapsedNow } from '../utils';

vi.mock('@beda.software/emr-config', () => ({
    default: { idleTimeoutMs: null, warningWindowBeforeIdleTimeoutMs: 10_000 },
}));

describe('Idle Timeout without a configured idleTimeoutMs', () => {
    it('renders nothing and never touches the persisted activity timestamp', () => {
        const setItem = vi.spyOn(window.localStorage, 'setItem');

        const { container } = render(
            <MemoryRouter>
                <IdleTimeout />
            </MemoryRouter>,
        );

        expect(container).toBeEmptyDOMElement();
        expect(setItem).not.toHaveBeenCalledWith(LAST_PROVIDER_ACTIVITY_STORAGE_KEY, expect.anything());
    });

    it('never reports the Idle Timeout as elapsed, however old the persisted timestamp', () => {
        vi.spyOn(window.localStorage, 'getItem').mockReturnValue('0');

        expect(isIdleTimeoutElapsedNow()).toBe(false);
    });
});
