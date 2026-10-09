import { describe, expect, it } from 'vitest';

import { isIdleTimeoutElapsed } from '../utils';

const config = { idleTimeoutMs: 1000, warningWindowBeforeIdleTimeoutMs: 100 };

describe('isIdleTimeoutElapsed', () => {
    it('is false while within the Idle Timeout, including the Warning Window', () => {
        expect(isIdleTimeoutElapsed(950, '0', config)).toBe(false);
    });

    it('is true once the persisted last activity is older than the Idle Timeout', () => {
        expect(isIdleTimeoutElapsed(1000, '0', config)).toBe(true);
    });

    it('is false when no valid last activity is persisted', () => {
        expect(isIdleTimeoutElapsed(5000, null, config)).toBe(false);
        expect(isIdleTimeoutElapsed(5000, 'garbage', config)).toBe(false);
    });
});
