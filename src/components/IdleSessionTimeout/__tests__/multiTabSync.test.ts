import { describe, expect, it } from 'vitest';

import { LAST_ACTIVITY_STORAGE_KEY, STATE_BROADCAST_STORAGE_KEY, interpretStorageEvent } from '../multiTabSync';

describe('interpretStorageEvent', () => {
    it('reads a bare clear() (key === null) as the Session having ended', () => {
        expect(interpretStorageEvent({ key: null, newValue: null })).toEqual({ type: 'sessionEnded' });
    });

    it('reads a valid last-activity write as remote Provider Activity', () => {
        expect(interpretStorageEvent({ key: LAST_ACTIVITY_STORAGE_KEY, newValue: '12345' })).toEqual({
            type: 'activity',
            at: 12345,
        });
    });

    it.each([null, '', 'not-a-number', 'NaN'])(
        'ignores a last-activity write with an unusable value (%p)',
        (newValue) => {
            expect(interpretStorageEvent({ key: LAST_ACTIVITY_STORAGE_KEY, newValue })).toEqual({ type: 'ignore' });
        },
    );

    it('reads a state-broadcast write as a request to recheck, regardless of its value', () => {
        expect(interpretStorageEvent({ key: STATE_BROADCAST_STORAGE_KEY, newValue: '999' })).toEqual({
            type: 'recheck',
        });
    });

    it('ignores unrelated storage keys', () => {
        expect(interpretStorageEvent({ key: 'token', newValue: 'abc' })).toEqual({ type: 'ignore' });
        expect(interpretStorageEvent({ key: 'some_other_key', newValue: 'x' })).toEqual({ type: 'ignore' });
    });
});
