import {
    DraftFlushFn,
    IdleTimeoutConfig,
    IdleTimeoutEvaluation,
    IdleTimeoutState,
    MultiTabSyncSignal,
    RawIdleTimeoutConfig,
    StorageEventLike,
} from './types';

export const DEFAULT_IDLE_TIMEOUT_MS = 30 * 60 * 1000;
export const DEFAULT_WARNING_WINDOW_MS = 2 * 60 * 1000;

function isPositiveFiniteNumber(value: unknown): value is number {
    return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

// A Warning Window not shorter than the Idle Timeout would show from sign-in, so it
// falls back to the default, capped at half the Idle Timeout.
export function resolveIdleTimeoutConfig(raw: RawIdleTimeoutConfig): IdleTimeoutConfig {
    const idleTimeoutMs = isPositiveFiniteNumber(raw.idleTimeoutMs) ? raw.idleTimeoutMs : DEFAULT_IDLE_TIMEOUT_MS;
    const requestedWarningWindowMs = isPositiveFiniteNumber(raw.warningWindowMs)
        ? raw.warningWindowMs
        : DEFAULT_WARNING_WINDOW_MS;

    if (requestedWarningWindowMs < idleTimeoutMs) {
        return { idleTimeoutMs, warningWindowMs: requestedWarningWindowMs };
    }

    return { idleTimeoutMs, warningWindowMs: Math.min(DEFAULT_WARNING_WINDOW_MS, idleTimeoutMs / 2) };
}

export function deriveIdleTimeoutState(elapsedMs: number, config: IdleTimeoutConfig): IdleTimeoutState {
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
export class IdleTimeoutController {
    private readonly config: IdleTimeoutConfig;
    private lastProviderActivityAt: number;
    private state: IdleTimeoutState;

    constructor(config: IdleTimeoutConfig, now: number) {
        this.config = config;
        this.lastProviderActivityAt = now;
        this.state = deriveIdleTimeoutState(0, config);
    }

    recordProviderActivity(now: number): IdleTimeoutEvaluation {
        this.lastProviderActivityAt = now;
        return this.evaluate(now);
    }

    evaluate(now: number): IdleTimeoutEvaluation {
        const previousState = this.state;
        this.state = deriveIdleTimeoutState(now - this.lastProviderActivityAt, this.config);

        const forcedSignOut = this.state === 'expired' && previousState !== 'expired';

        return { state: this.state, previousState, forcedSignOut };
    }

    getState(): IdleTimeoutState {
        return this.state;
    }
}

// Module-level singleton: the Questionnaire Draft form currently open (if any)
// registers its flush function here, so the idle timeout hook — mounted far away
// at the app root, with no knowledge of which form is open — can reach it.
let activeDraftFlush: DraftFlushFn | undefined;

export function registerActiveDraftFlush(flush: DraftFlushFn): () => void {
    activeDraftFlush = flush;

    return () => {
        if (activeDraftFlush === flush) {
            activeDraftFlush = undefined;
        }
    };
}

const DEFAULT_DRAFT_FLUSH_TIMEOUT_MS = 3000;

// Never rejects and never waits longer than timeoutMs, so a failing flush can't
// delay or prevent the Forced Sign-Out that triggered it.
export async function flushActiveDraftBestEffort(timeoutMs: number = DEFAULT_DRAFT_FLUSH_TIMEOUT_MS): Promise<void> {
    const flush = activeDraftFlush;
    if (!flush) {
        return;
    }

    await Promise.race([
        flush().then(
            () => undefined,
            () => undefined,
        ),
        new Promise<void>((resolve) => setTimeout(resolve, timeoutMs)),
    ]);
}

export const LAST_PROVIDER_ACTIVITY_STORAGE_KEY = 'idle_timeout_last_provider_activity_at';

// No payload needed: it only nudges other tabs to recheck immediately (rather than
// wait out their own recheck interval) when a state change wasn't itself a storage write.
export const STATE_BROADCAST_STORAGE_KEY = 'idle_timeout_state_broadcast_at';

// Shared by the read-on-load path and the `storage` event handler, so a persisted or
// broadcast last-Provider-Activity timestamp is parsed and validated in exactly one place.
export function parsePersistedTimestamp(raw: string | null): number | undefined {
    const parsed = raw ? Number(raw) : NaN;

    return Number.isFinite(parsed) ? parsed : undefined;
}

// `key === null` is how doLogout()'s `localStorage.clear()` — from a Forced or Manual
// Sign-Out in any tab — is observed here. The sign-out reason lands just after the clear,
// synchronously, so it's in place before this tab's redirect reaches the sign-in screen.
export function interpretStorageEvent(event: StorageEventLike): MultiTabSyncSignal {
    if (event.key === null) {
        return { type: 'sessionEnded' };
    }

    if (event.key === LAST_PROVIDER_ACTIVITY_STORAGE_KEY) {
        const parsed = parsePersistedTimestamp(event.newValue);

        return parsed === undefined ? { type: 'ignore' } : { type: 'providerActivity', at: parsed };
    }

    if (event.key === STATE_BROADCAST_STORAGE_KEY) {
        return { type: 'recheck' };
    }

    return { type: 'ignore' };
}
