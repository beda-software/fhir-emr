import { describe, expect, it } from 'vitest';

import {
    DEFAULT_WARNING_WINDOW_MS,
    IdleTimeoutController,
    deriveIdleTimeoutState,
    resolveIdleTimeoutConfig,
} from '../utils';

const config = { idleTimeoutMs: 30 * 60 * 1000, warningWindowBeforeIdleTimeoutMs: 2 * 60 * 1000 };

describe('deriveIdleTimeoutState', () => {
    it('is active before the warning window starts', () => {
        expect(deriveIdleTimeoutState(0, config)).toBe('active');
        expect(deriveIdleTimeoutState(27 * 60 * 1000, config)).toBe('active');
    });

    it('is warning once inside the warning window', () => {
        expect(deriveIdleTimeoutState(28 * 60 * 1000, config)).toBe('warning');
        expect(deriveIdleTimeoutState(29.5 * 60 * 1000, config)).toBe('warning');
    });

    it('is expired once the idle timeout elapses', () => {
        expect(deriveIdleTimeoutState(30 * 60 * 1000, config)).toBe('expired');
        expect(deriveIdleTimeoutState(45 * 60 * 1000, config)).toBe('expired');
    });
});

describe('IdleTimeoutController', () => {
    it('starts active at construction time', () => {
        const controller = new IdleTimeoutController(config, 0);

        expect(controller.getState()).toBe('active');
    });

    it('transitions active -> warning -> expired as time passes with no activity, requesting Forced Sign-Out only on the expiry transition', () => {
        const controller = new IdleTimeoutController(config, 0);

        expect(controller.evaluate(27 * 60 * 1000)).toEqual({
            state: 'active',
            previousState: 'active',
            forcedSignOut: false,
        });
        expect(controller.evaluate(28 * 60 * 1000)).toEqual({
            state: 'warning',
            previousState: 'active',
            forcedSignOut: false,
        });
        expect(controller.evaluate(30 * 60 * 1000)).toEqual({
            state: 'expired',
            previousState: 'warning',
            forcedSignOut: true,
        });
    });

    it('reports expired immediately (and requests Forced Sign-Out) if constructed long after the last activity (e.g. after a reload)', () => {
        // A negative `now` simulates a persisted timestamp already past the Idle Timeout.
        const controller = new IdleTimeoutController(config, -45 * 60 * 1000);

        expect(controller.evaluate(0)).toEqual({
            state: 'expired',
            previousState: 'active',
            forcedSignOut: true,
        });
    });

    it('recordProviderActivity resets elapsed time back to active, cancelling a pending warning or expiry', () => {
        const controller = new IdleTimeoutController(config, 0);
        controller.evaluate(29 * 60 * 1000);
        expect(controller.getState()).toBe('warning');

        const activityAt = 29 * 60 * 1000 + 1;
        const evaluation = controller.recordProviderActivity(activityAt);

        expect(evaluation).toEqual({ state: 'active', previousState: 'warning', forcedSignOut: false });
        // State is 'warning' at activityAt + Idle Timeout - Warning Window, confirming
        // the reset activity time was recorded rather than just the returned state.
        expect(
            controller.evaluate(activityAt + config.idleTimeoutMs - config.warningWindowBeforeIdleTimeoutMs).state,
        ).toBe('warning');
    });

    it('recordProviderActivity resets even from expired', () => {
        const controller = new IdleTimeoutController(config, 0);
        controller.evaluate(31 * 60 * 1000);
        expect(controller.getState()).toBe('expired');

        const evaluation = controller.recordProviderActivity(31 * 60 * 1000 + 1);

        expect(evaluation).toEqual({ state: 'active', previousState: 'expired', forcedSignOut: false });
    });

    it('does not re-request Forced Sign-Out on repeated evaluation while already expired', () => {
        const controller = new IdleTimeoutController(config, 0);
        controller.evaluate(31 * 60 * 1000);

        const evaluation = controller.evaluate(32 * 60 * 1000);

        expect(evaluation).toEqual({ state: 'expired', previousState: 'expired', forcedSignOut: false });
    });

    it('never counts mouse movement or scrolling because evaluate() is never invoked for them', () => {
        const controller = new IdleTimeoutController(config, 0);

        controller.evaluate(10 * 60 * 1000);
        controller.evaluate(20 * 60 * 1000);
        const evaluation = controller.evaluate(31 * 60 * 1000);

        expect(evaluation.state).toBe('expired');
    });
});

describe('resolveIdleTimeoutConfig', () => {
    it.each([NaN, Infinity, -1, 0])('throws for an invalid Idle Timeout of %p seconds', (invalid) => {
        expect(() => resolveIdleTimeoutConfig({ idleTimeoutSeconds: invalid })).toThrow(/idleTimeoutSeconds/);
    });

    it('converts both durations from seconds', () => {
        expect(resolveIdleTimeoutConfig({ idleTimeoutSeconds: 600, warningWindowSeconds: 60 })).toEqual({
            idleTimeoutMs: 10 * 60 * 1000,
            warningWindowBeforeIdleTimeoutMs: 60 * 1000,
        });
    });

    it('accepts fractional seconds', () => {
        expect(resolveIdleTimeoutConfig({ idleTimeoutSeconds: 0.5, warningWindowSeconds: 0.1 })).toEqual({
            idleTimeoutMs: 500,
            warningWindowBeforeIdleTimeoutMs: 100,
        });
    });

    it('falls back to the default Warning Window when only the Idle Timeout is given', () => {
        expect(resolveIdleTimeoutConfig({ idleTimeoutSeconds: 600 })).toEqual({
            idleTimeoutMs: 10 * 60 * 1000,
            warningWindowBeforeIdleTimeoutMs: DEFAULT_WARNING_WINDOW_MS,
        });
    });

    it.each([300, 600])(
        'falls back to the default Warning Window when a given %p seconds is not shorter than the Idle Timeout',
        (warningWindowSeconds) => {
            expect(resolveIdleTimeoutConfig({ idleTimeoutSeconds: 300, warningWindowSeconds })).toEqual({
                idleTimeoutMs: 5 * 60 * 1000,
                warningWindowBeforeIdleTimeoutMs: DEFAULT_WARNING_WINDOW_MS,
            });
        },
    );

    it('caps the fallback Warning Window at half the Idle Timeout when the default would not fit', () => {
        expect(resolveIdleTimeoutConfig({ idleTimeoutSeconds: 60 })).toEqual({
            idleTimeoutMs: 60 * 1000,
            warningWindowBeforeIdleTimeoutMs: 30 * 1000,
        });
    });

    it('never starts in the Warning Window, whatever the given Warning Window', () => {
        const resolved = resolveIdleTimeoutConfig({ idleTimeoutSeconds: 300, warningWindowSeconds: 600 });

        expect(deriveIdleTimeoutState(0, resolved)).toBe('active');
        expect(deriveIdleTimeoutState(3 * 60 * 1000, resolved)).toBe('warning');
        expect(deriveIdleTimeoutState(5 * 60 * 1000, resolved)).toBe('expired');
    });
});
