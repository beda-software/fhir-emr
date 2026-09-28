export const LAST_ACTIVITY_STORAGE_KEY = 'idle_session_last_activity_at';

// No payload needed: it only nudges other tabs to recheck immediately (rather than
// wait out their own recheck interval) when a state change wasn't itself a storage write.
export const STATE_BROADCAST_STORAGE_KEY = 'idle_session_state_broadcast_at';

export type MultiTabSyncSignal =
    | { type: 'sessionEnded' }
    | { type: 'activity'; at: number }
    | { type: 'recheck' }
    | { type: 'ignore' };

export interface StorageEventLike {
    key: string | null;
    newValue: string | null;
}

// `key === null` is how doLogout()'s `localStorage.clear()` — from a Forced or Manual
// Sign-Out in any tab — is observed here; by the time it fires, localStorage (including
// any sign-out reason) is already fully updated, so no event payload needs inspecting.
export function interpretStorageEvent(event: StorageEventLike): MultiTabSyncSignal {
    if (event.key === null) {
        return { type: 'sessionEnded' };
    }

    if (event.key === LAST_ACTIVITY_STORAGE_KEY) {
        const parsed = event.newValue ? Number(event.newValue) : NaN;

        return Number.isFinite(parsed) ? { type: 'activity', at: parsed } : { type: 'ignore' };
    }

    if (event.key === STATE_BROADCAST_STORAGE_KEY) {
        return { type: 'recheck' };
    }

    return { type: 'ignore' };
}
