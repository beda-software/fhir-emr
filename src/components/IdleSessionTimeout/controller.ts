export type IdleSessionState = 'active' | 'warning' | 'expired';

export type IdleSessionEffect = 'endSession';

export interface IdleSessionTimeoutConfig {
    idleTimeoutMs: number;
    warningWindowMs: number;
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
            effects.push('endSession');
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
