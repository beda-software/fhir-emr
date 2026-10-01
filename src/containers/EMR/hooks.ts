import { useEffect } from 'react';

import config from '@beda.software/emr-config';

import { isIdleTimeoutElapsedNow } from 'src/components/IdleTimeout/utils';
import { doLogout, getToken, refreshSession } from 'src/services/auth';
import { axiosInstance } from 'src/services/fhir';
import { installSessionRejectionInterceptor } from 'src/services/sessionRejection';

// Registered only while the authenticated app is mounted, so anonymous routes never
// see it and remounts (or tests) never stack a second copy.
export function useSessionRejectionInterceptor() {
    useEffect(
        () =>
            installSessionRejectionInterceptor(axiosInstance, {
                baseURL: config.baseURL,
                getToken,
                isIdleTimeoutElapsed: isIdleTimeoutElapsedNow,
                endSession: doLogout,
                refreshSession,
            }),
        [],
    );
}
