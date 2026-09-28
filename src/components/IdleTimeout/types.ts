export type IdleTimeoutState = 'active' | 'warning' | 'expired';

export interface IdleTimeoutConfig {
    idleTimeoutMs: number;
    warningWindowMs: number;
}

export interface RawIdleTimeoutConfig {
    idleTimeoutMs?: number;
    warningWindowMs?: number;
}

export interface IdleTimeoutEvaluation {
    state: IdleTimeoutState;
    previousState: IdleTimeoutState;
    forcedSignOut: boolean;
}

export type IdleTimeoutEvaluationOrigin = 'local' | 'remote';

export type DraftFlushFn = () => Promise<unknown>;

export type MultiTabSyncSignal =
    | { type: 'sessionEnded' }
    | { type: 'providerActivity'; at: number }
    | { type: 'recheck' }
    | { type: 'ignore' };

export interface StorageEventLike {
    key: string | null;
    newValue: string | null;
}

export interface UseIdleTimeoutResult {
    state: IdleTimeoutState;
    recordProviderActivity: () => void;
    signOutNow: () => void;
}

// Any field left out falls back to fhir-emr's default, translated Warning Window copy.
export interface WarningWindowTexts {
    title?: string;
    body?: string;
    stayLabel?: string;
    signOutLabel?: string;
}
