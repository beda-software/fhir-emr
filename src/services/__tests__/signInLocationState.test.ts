import { describe, expect, it } from 'vitest';

import { parseSignInLocationState } from 'src/services/auth';

describe('parseSignInLocationState', () => {
    it('keeps a valid nextUrl and expired reason', () => {
        expect(parseSignInLocationState({ nextUrl: '/patients', signOutReason: 'expired' })).toEqual({
            nextUrl: '/patients',
            signOutReason: 'expired',
        });
    });

    it.each([null, undefined, 'str', 42, {}, { nextUrl: 1, signOutReason: 'manual' }])(
        'drops anything else (%j)',
        (state) => {
            expect(parseSignInLocationState(state)).toEqual({ nextUrl: undefined, signOutReason: undefined });
        },
    );
});
