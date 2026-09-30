import { describe, expect, it, vi } from 'vitest';

import config from '@beda.software/emr-config';

import { logout } from 'src/services/auth';
import { axiosInstance } from 'src/services/fhir';
import { installSessionRejectionInterceptor } from 'src/services/sessionRejection';
import { login } from 'src/setupTests';

// Detects Aidbox drift from what the interceptor relies on: a revoked Session yields 401.
describe('session rejection against a real Aidbox', () => {
    it('ends the Session as expired when a request follows server-side revocation', async () => {
        const token = await login({ email: 'admin', id: 'admin', password: 'password' } as never);
        const endSession = vi.fn();
        const eject = installSessionRejectionInterceptor(axiosInstance, {
            baseURL: config.baseURL,
            getToken: () => token.access_token,
            isIdleTimeoutElapsed: () => false,
            endSession,
        });

        try {
            await logout();
            expect(endSession).not.toHaveBeenCalled();

            await expect(axiosInstance.get('/fhir/Patient', { params: { _count: 1 } })).rejects.toMatchObject({
                response: { status: 401 },
            });

            expect(endSession).toHaveBeenCalledTimes(1);
            expect(endSession).toHaveBeenCalledWith('expired');
        } finally {
            eject();
        }
    });
});
