import queryString from 'query-string';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import config from '@beda.software/emr-config';

import { doLogout, getToken, parseOAuthState, refreshSession, type SignInLocationState } from 'src/services/auth';
import { axiosInstance } from 'src/services/fhir';
import { installSessionRejectionInterceptor } from 'src/services/sessionRejection';

// Mounted with the EMR container so it also covers Session restore. Anonymous requests stay out
// because of the Bearer-token check, not because of where this is mounted. Covers only requests
// on the shared HTTP client; an installation the app made earlier is reused.
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

export function useRedirectToSignInState(): SignInLocationState {
    const location = useLocation();

    return { nextUrl: `${location.pathname}${location.search}${location.hash}` };
}

export function useCodeGrantFailureSignInState(): SignInLocationState {
    const location = useLocation();
    const { state } = queryString.parse(location.search);
    const nextUrl = parseOAuthState(typeof state === 'string' ? state : undefined).nextUrl;

    return { signInFailure: 'code-exchange', nextUrl };
}
