import {
    IdleTimeoutConfig,
    IdleTimeoutEvaluation,
    IdleTimeoutProps,
    IdleTimeoutState,
    MultiTabSyncSignal,
    StorageEventLike,
} from './types';

export const DEFAULT_WARNING_WINDOW_MS = 2 * 60 * 1000;

function isPositiveFiniteNumber(value: unknown): value is number {
    return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

// A Warning Window not shorter than the Idle Timeout would show from sign-in, so it
// falls back to the default, capped at half the Idle Timeout.
export function resolveIdleTimeoutConfig({
    idleTimeoutSeconds,
    warningWindowSeconds,
}: IdleTimeoutProps): IdleTimeoutConfig {
    if (!isPositiveFiniteNumber(idleTimeoutSeconds)) {
        throw new Error(`IdleTimeout: idleTimeoutSeconds must be a positive number, got ${idleTimeoutSeconds}`);
    }

    const idleTimeoutMs = idleTimeoutSeconds * 1000;
    const requestedWarningWindowMs = isPositiveFiniteNumber(warningWindowSeconds)
        ? warningWindowSeconds * 1000
        : DEFAULT_WARNING_WINDOW_MS;

    if (requestedWarningWindowMs < idleTimeoutMs) {
        return { idleTimeoutMs, warningWindowBeforeIdleTimeoutMs: requestedWarningWindowMs };
    }

    return { idleTimeoutMs, warningWindowBeforeIdleTimeoutMs: Math.min(DEFAULT_WARNING_WINDOW_MS, idleTimeoutMs / 2) };
}

let mountedIdleTimeoutConfig: IdleTimeoutConfig | undefined;

export function registerMountedIdleTimeout(config: IdleTimeoutConfig) {
    mountedIdleTimeoutConfig = config;

    return () => {
        mountedIdleTimeoutConfig = undefined;
    };
}

export function deriveIdleTimeoutState(elapsedMs: number, config: IdleTimeoutConfig): IdleTimeoutState {
    if (elapsedMs >= config.idleTimeoutMs) {
        return 'expired';
    }
    if (elapsedMs >= config.idleTimeoutMs - config.warningWindowBeforeIdleTimeoutMs) {
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

export const LAST_PROVIDER_ACTIVITY_STORAGE_KEY = 'idle_timeout_last_provider_activity_at';

// No payload needed: it only nudges other tabs to recheck immediately (rather than
// wait out their own recheck interval) when a state change wasn't itself a storage write.
export const STATE_BROADCAST_STORAGE_KEY = 'idle_timeout_state_broadcast_at';

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

// Reads the persisted timestamp rather than a mounted controller's state, so it is
// correct even when the Idle Timeout has elapsed while this tab's recheck was throttled.
export function isIdleTimeoutElapsed(now: number, persistedLastActivityAt: string | null, config: IdleTimeoutConfig) {
    const lastActivityAt = parsePersistedTimestamp(persistedLastActivityAt);

    return lastActivityAt !== undefined && deriveIdleTimeoutState(now - lastActivityAt, config) === 'expired';
}

// False while no IdleTimeout is mounted, so a timestamp left by an earlier Session
// can't force a sign-out in an app that doesn't use the Idle Timeout.
export function isIdleTimeoutElapsedNow(): boolean {
    if (!mountedIdleTimeoutConfig) {
        return false;
    }

    return isIdleTimeoutElapsed(
        Date.now(),
        window.localStorage.getItem(LAST_PROVIDER_ACTIVITY_STORAGE_KEY),
        mountedIdleTimeoutConfig,
    );
}
