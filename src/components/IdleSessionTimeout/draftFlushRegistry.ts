// Module-level singleton: the Questionnaire Draft form currently open (if any)
// registers its flush function here, so the idle session hook — mounted far away
// at the app root, with no knowledge of which form is open — can reach it.
export type DraftFlushFn = () => Promise<unknown>;

let activeDraftFlush: DraftFlushFn | undefined;

export function registerActiveDraftFlush(flush: DraftFlushFn): () => void {
    activeDraftFlush = flush;

    return () => {
        if (activeDraftFlush === flush) {
            activeDraftFlush = undefined;
        }
    };
}

export const DEFAULT_DRAFT_FLUSH_TIMEOUT_MS = 3000;

// Best-effort: never rejects and never blocks longer than timeoutMs, so a network
// hiccup during the flush can never delay or prevent the Forced Sign-Out that
// triggered it.
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
