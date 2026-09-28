import { describe, expect, it } from 'vitest';

import {
    DEFAULT_IDLE_TIMEOUT_MS,
    DEFAULT_WARNING_WINDOW_MS,
    IdleSessionController,
    deriveIdleSessionState,
    resolveIdleSessionTimeoutConfig,
} from '../controller';

const config = { idleTimeoutMs: 30 * 60 * 1000, warningWindowMs: 2 * 60 * 1000 };

describe('deriveIdleSessionState', () => {
    it('is active before the warning window starts', () => {
        expect(deriveIdleSessionState(0, config)).toBe('active');
        expect(deriveIdleSessionState(27 * 60 * 1000, config)).toBe('active');
    });

    it('is warning once inside the warning window', () => {
        expect(deriveIdleSessionState(28 * 60 * 1000, config)).toBe('warning');
        expect(deriveIdleSessionState(29.5 * 60 * 1000, config)).toBe('warning');
    });

    it('is expired once the idle timeout elapses', () => {
        expect(deriveIdleSessionState(30 * 60 * 1000, config)).toBe('expired');
        expect(deriveIdleSessionState(45 * 60 * 1000, config)).toBe('expired');
    });
});

describe('IdleSessionController', () => {
    it('starts active at construction time', () => {
        const controller = new IdleSessionController(config, 0);

        expect(controller.getState()).toBe('active');
        expect(controller.getLastActivityAt()).toBe(0);
    });

    it('transitions active -> warning -> expired as time passes with no activity, requesting endSession only on the expiry transition', () => {
        const controller = new IdleSessionController(config, 0);

        expect(controller.evaluate(27 * 60 * 1000)).toEqual({
            state: 'active',
            previousState: 'active',
            effects: [],
        });
        expect(controller.evaluate(28 * 60 * 1000)).toEqual({
            state: 'warning',
            previousState: 'active',
            effects: [],
        });
        expect(controller.evaluate(30 * 60 * 1000)).toEqual({
            state: 'expired',
            previousState: 'warning',
            effects: ['endSession'],
        });
    });

    it('reports expired immediately (and requests endSession) if constructed long after the last activity (e.g. after a reload)', () => {
        // A negative `now` at construction simulates rehydrating from a persisted
        // timestamp already older than the idle timeout (e.g. reload after backgrounding).
        const controller = new IdleSessionController(config, -45 * 60 * 1000);

        expect(controller.evaluate(0)).toEqual({ state: 'expired', previousState: 'active', effects: ['endSession'] });
    });

    it('recordActivity resets elapsed time back to active, cancelling a pending warning or expiry', () => {
        const controller = new IdleSessionController(config, 0);
        controller.evaluate(29 * 60 * 1000);
        expect(controller.getState()).toBe('warning');

        const evaluation = controller.recordActivity(29 * 60 * 1000 + 1);

        expect(evaluation).toEqual({ state: 'active', previousState: 'warning', effects: [] });
        expect(controller.getLastActivityAt()).toBe(29 * 60 * 1000 + 1);
    });

    it('recordActivity resets even from expired', () => {
        const controller = new IdleSessionController(config, 0);
        controller.evaluate(31 * 60 * 1000);
        expect(controller.getState()).toBe('expired');

        const evaluation = controller.recordActivity(31 * 60 * 1000 + 1);

        expect(evaluation).toEqual({ state: 'active', previousState: 'expired', effects: [] });
    });

    it('does not re-request endSession on repeated evaluation while already expired', () => {
        const controller = new IdleSessionController(config, 0);
        controller.evaluate(31 * 60 * 1000);

        const evaluation = controller.evaluate(32 * 60 * 1000);

        expect(evaluation).toEqual({ state: 'expired', previousState: 'expired', effects: [] });
    });

    it('never counts mouse movement or scrolling because evaluate() is never invoked for them', () => {
        // evaluate() alone (no recordActivity()) never resets the clock, whatever DOM event drove the caller to call it.
        const controller = new IdleSessionController(config, 0);

        controller.evaluate(10 * 60 * 1000);
        controller.evaluate(20 * 60 * 1000);
        const evaluation = controller.evaluate(31 * 60 * 1000);

        expect(evaluation.state).toBe('expired');
        expect(controller.getLastActivityAt()).toBe(0);
    });
});

describe('resolveIdleSessionTimeoutConfig', () => {
    it('falls back to the defaults (30 minutes / 2 minutes) when both values are omitted', () => {
        expect(resolveIdleSessionTimeoutConfig({})).toEqual({
            idleTimeoutMs: DEFAULT_IDLE_TIMEOUT_MS,
            warningWindowMs: DEFAULT_WARNING_WINDOW_MS,
        });
    });

    it('uses the configured values when both are valid', () => {
        expect(resolveIdleSessionTimeoutConfig({ idleTimeoutMs: 10 * 60 * 1000, warningWindowMs: 60 * 1000 })).toEqual({
            idleTimeoutMs: 10 * 60 * 1000,
            warningWindowMs: 60 * 1000,
        });
    });

    it('falls back to the default idle timeout when only the warning window is configured', () => {
        expect(resolveIdleSessionTimeoutConfig({ warningWindowMs: 60 * 1000 })).toEqual({
            idleTimeoutMs: DEFAULT_IDLE_TIMEOUT_MS,
            warningWindowMs: 60 * 1000,
        });
    });

    it.each([NaN, Infinity, -1, 0])('treats %p as an invalid idle timeout and falls back to the default', (invalid) => {
        expect(resolveIdleSessionTimeoutConfig({ idleTimeoutMs: invalid })).toEqual({
            idleTimeoutMs: DEFAULT_IDLE_TIMEOUT_MS,
            warningWindowMs: DEFAULT_WARNING_WINDOW_MS,
        });
    });

    it('clamps a Warning Window longer than the Idle Timeout instead of producing a negative countdown', () => {
        expect(
            resolveIdleSessionTimeoutConfig({ idleTimeoutMs: 5 * 60 * 1000, warningWindowMs: 10 * 60 * 1000 }),
        ).toEqual({
            idleTimeoutMs: 5 * 60 * 1000,
            warningWindowMs: 5 * 60 * 1000,
        });
    });

    it('produces a config that keeps deriveIdleSessionState sane when the Warning Window is clamped', () => {
        const resolved = resolveIdleSessionTimeoutConfig({
            idleTimeoutMs: 5 * 60 * 1000,
            warningWindowMs: 10 * 60 * 1000,
        });

        // The whole window is now "warning" from the very first check, never a negative threshold.
        expect(deriveIdleSessionState(0, resolved)).toBe('warning');
        expect(deriveIdleSessionState(5 * 60 * 1000, resolved)).toBe('expired');
    });
});
