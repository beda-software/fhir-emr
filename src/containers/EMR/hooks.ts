import { useEffect } from 'react';

import config from '@beda.software/emr-config';

import { doLogout, getToken, refreshSession } from 'src/services/auth';
import { axiosInstance } from 'src/services/fhir';
import { installSessionRejectionInterceptor } from 'src/services/sessionRejection';

// Mounted with the EMR container so it also covers Session restore. Anonymous requests stay out
// because of the Bearer-token check, not because of where this is mounted. Covers only requests
// on the shared HTTP client; remounts (or tests) never stack a second copy.
export function useSessionRejectionInterceptor() {
    useEffect(
        () =>
            installSessionRejectionInterceptor(axiosInstance, {
                baseURL: config.baseURL,
                getToken,
                endSession: doLogout,
                refreshSession,
            }),
        [],
    );
}
