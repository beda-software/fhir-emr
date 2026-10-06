import { AxiosError } from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { User } from '@beda.software/aidbox-types';
import { failure, success } from '@beda.software/remote-data';

import { restoreUserSession, SessionLifecycle } from 'src/containers/App/utils';
import { axiosInstance } from 'src/services/fhir';

function rejectedWith(status: number | undefined) {
    return () =>
        axiosInstance
            .get('/auth/userinfo', {
                adapter: () =>
                    Promise.reject(
                        new AxiosError(
                            status ? 'rejected' : 'Network Error',
                            undefined,
                            undefined,
                            undefined,
                            status ? ({ status } as never) : undefined,
                        ),
                    ),
            })
            .then(
                () => success({} as User),
                (error) => failure(error.message),
            );
}

const user = () => Promise.resolve(success({} as User));

describe('restoreUserSession with a rejected access token', () => {
    let sessionLifecycle: { [K in keyof SessionLifecycle]: ReturnType<typeof vi.fn> };

    beforeEach(() => {
        sessionLifecycle = {
            refreshSession: vi.fn(async () => 'fresh'),
            endSession: vi.fn(async () => undefined),
        };
    });

    const restore = (populate: () => Promise<any>) => restoreUserSession('stale', populate, sessionLifecycle as never);

    it('refreshes once and retries the restore once', async () => {
        const populate = vi.fn().mockImplementationOnce(rejectedWith(401)).mockImplementationOnce(user);

        const result = await restore(populate);

        expect(result).toEqual(success({}));
        expect(sessionLifecycle.refreshSession).toHaveBeenCalledTimes(1);
        expect(populate).toHaveBeenCalledTimes(2);
        expect(sessionLifecycle.endSession).not.toHaveBeenCalled();
    });

    it('ends the Session as expired when the refresh fails', async () => {
        sessionLifecycle.refreshSession.mockRejectedValue(
            new AxiosError('rejected', undefined, undefined, undefined, { status: 400 } as never),
        );
        const populate = vi.fn(rejectedWith(401));

        await expect(restore(populate)).resolves.toEqual(success(null));

        expect(populate).toHaveBeenCalledTimes(1);
        expect(sessionLifecycle.endSession).toHaveBeenCalledWith('expired');
    });

    it('keeps the Session when the refresh fails transiently', async () => {
        sessionLifecycle.refreshSession.mockRejectedValue(new AxiosError('Network Error'));
        const populate = vi.fn(rejectedWith(401));

        await expect(restore(populate)).resolves.toEqual(success(null));

        expect(populate).toHaveBeenCalledTimes(1);
        expect(sessionLifecycle.endSession).not.toHaveBeenCalled();
    });

    it('ends the Session as expired when the retry is rejected too', async () => {
        const populate = vi.fn(rejectedWith(401));

        await expect(restore(populate)).resolves.toEqual(success(null));

        expect(sessionLifecycle.refreshSession).toHaveBeenCalledTimes(1);
        expect(populate).toHaveBeenCalledTimes(2);
        expect(sessionLifecycle.endSession).toHaveBeenCalledWith('expired');
    });

    it('behaves as before without a refresh credential', async () => {
        sessionLifecycle.refreshSession.mockResolvedValue(undefined);

        await expect(restore(vi.fn(rejectedWith(401)))).resolves.toEqual(success(null));

        expect(sessionLifecycle.endSession).not.toHaveBeenCalled();
    });

    it('does not refresh or sign out on a network failure', async () => {
        const result = await restore(vi.fn(rejectedWith(undefined)));

        expect(result).toMatchObject({ status: 'Failure' });
        expect(sessionLifecycle.refreshSession).not.toHaveBeenCalled();
        expect(sessionLifecycle.endSession).not.toHaveBeenCalled();
    });

    it('does not refresh on a non-401 failure', async () => {
        await restore(vi.fn(rejectedWith(500)));

        expect(sessionLifecycle.refreshSession).not.toHaveBeenCalled();
        expect(sessionLifecycle.endSession).not.toHaveBeenCalled();
    });
});
