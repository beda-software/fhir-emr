export type IdleSessionState = 'active' | 'warning' | 'expired';

// Order matters: the caller runs effects in the order given, so 'flushDraft' is
// listed before 'endSession' — the Questionnaire Draft flush must be attempted
// before the Session actually ends.
export type IdleSessionEffect = 'flushDraft' | 'endSession';

export interface IdleSessionTimeoutConfig {
    idleTimeoutMs: number;
    warningWindowMs: number;
}

export const DEFAULT_IDLE_TIMEOUT_MS = 30 * 60 * 1000;
export const DEFAULT_WARNING_WINDOW_MS = 2 * 60 * 1000;

export interface RawIdleSessionTimeoutConfig {
    idleTimeoutMs?: number;
    warningWindowMs?: number;
}

function isPositiveFiniteNumber(value: unknown): value is number {
    return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

// Clamped to idleTimeoutMs so a Warning Window configured longer than the Idle
// Timeout can't produce a negative or nonsensical countdown.
export function resolveIdleSessionTimeoutConfig(raw: RawIdleSessionTimeoutConfig): IdleSessionTimeoutConfig {
    const idleTimeoutMs = isPositiveFiniteNumber(raw.idleTimeoutMs) ? raw.idleTimeoutMs : DEFAULT_IDLE_TIMEOUT_MS;
    const requestedWarningWindowMs = isPositiveFiniteNumber(raw.warningWindowMs)
        ? raw.warningWindowMs
        : DEFAULT_WARNING_WINDOW_MS;

    return {
        idleTimeoutMs,
        warningWindowMs: Math.min(requestedWarningWindowMs, idleTimeoutMs),
    };
}

export interface IdleSessionEvaluation {
    state: IdleSessionState;
    previousState: IdleSessionState;
    effects: IdleSessionEffect[];
}

export function deriveIdleSessionState(elapsedMs: number, config: IdleSessionTimeoutConfig): IdleSessionState {
    if (elapsedMs >= config.idleTimeoutMs) {
        return 'expired';
    }
    if (elapsedMs >= config.idleTimeoutMs - config.warningWindowMs) {
        return 'warning';
    }
    return 'active';
}

// Compares `now` against a caller-supplied timestamp on each call rather than
// arming its own timer, so an intermittent recheck (e.g. on regained focus) still
// gets a correct state instead of one based on stale timer bookkeeping.
export class IdleSessionController {
    private readonly config: IdleSessionTimeoutConfig;
    private lastActivityAt: number;
    private state: IdleSessionState;

    constructor(config: IdleSessionTimeoutConfig, now: number) {
        this.config = config;
        this.lastActivityAt = now;
        this.state = deriveIdleSessionState(0, config);
    }

    recordActivity(now: number): IdleSessionEvaluation {
        this.lastActivityAt = now;
        return this.evaluate(now);
    }

    evaluate(now: number): IdleSessionEvaluation {
        const previousState = this.state;
        this.state = deriveIdleSessionState(now - this.lastActivityAt, this.config);

        const effects: IdleSessionEffect[] = [];
        if (this.state === 'expired' && previousState !== 'expired') {
            effects.push('flushDraft', 'endSession');
        }

        return { state: this.state, previousState, effects };
    }

    getState(): IdleSessionState {
        return this.state;
    }

    getLastActivityAt(): number {
        return this.lastActivityAt;
    }
}
