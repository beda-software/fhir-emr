import { afterEach, describe, expect, it, vi } from 'vitest';

import { flushActiveDraftBestEffort, registerActiveDraftFlush } from '../draftFlushRegistry';

describe('draftFlushRegistry', () => {
    afterEach(() => {
        vi.useRealTimers();
    });

    it('does nothing when no draft flush is registered', async () => {
        await expect(flushActiveDraftBestEffort()).resolves.toBeUndefined();
    });

    it('calls the registered flush function', async () => {
        const flush = vi.fn().mockResolvedValue(undefined);
        registerActiveDraftFlush(flush);

        await flushActiveDraftBestEffort();

        expect(flush).toHaveBeenCalledTimes(1);
    });

    it('unregister stops a flush function from being called', async () => {
        const flush = vi.fn().mockResolvedValue(undefined);
        const unregister = registerActiveDraftFlush(flush);
        unregister();

        await flushActiveDraftBestEffort();

        expect(flush).not.toHaveBeenCalled();
    });

    it('a later registration replaces an earlier one', async () => {
        const firstFlush = vi.fn().mockResolvedValue(undefined);
        const secondFlush = vi.fn().mockResolvedValue(undefined);
        registerActiveDraftFlush(firstFlush);
        registerActiveDraftFlush(secondFlush);

        await flushActiveDraftBestEffort();

        expect(firstFlush).not.toHaveBeenCalled();
        expect(secondFlush).toHaveBeenCalledTimes(1);
    });

    it('resolves without throwing when the flush function rejects', async () => {
        registerActiveDraftFlush(() => Promise.reject(new Error('network error')));

        await expect(flushActiveDraftBestEffort()).resolves.toBeUndefined();
    });

    it('resolves once the timeout elapses when the flush function never settles, without cancelling it', async () => {
        vi.useFakeTimers();
        let resolveFlush: () => void = () => undefined;
        const flush = vi.fn(
            () =>
                new Promise<void>((resolve) => {
                    resolveFlush = resolve;
                }),
        );
        registerActiveDraftFlush(flush);

        const flushPromise = flushActiveDraftBestEffort(1000);
        let settled = false;
        void flushPromise.then(() => {
            settled = true;
        });

        await vi.advanceTimersByTimeAsync(999);
        expect(settled).toBe(false);

        await vi.advanceTimersByTimeAsync(1);
        await flushPromise;
        expect(settled).toBe(true);

        resolveFlush();
    });
});
