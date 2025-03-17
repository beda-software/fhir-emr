import queryString from 'query-string';
import { Navigate, useLocation } from 'react-router-dom';

import { RenderRemoteData, useService } from '@beda.software/fhir-react';
import { failure, FetchError, isSuccess, success } from '@beda.software/remote-data';

import { Spinner } from 'src/components';
import {
    setToken,
    parseOAuthState,
    setIdToken,
    setRefreshToken,
    exchangeAuthorizationCodeForToken,
} from 'src/services/auth';

interface CodeGrantQueryParams {
    code?: string;
    state?: string;
}

export function CodeGrantAuth() {
    const location = useLocation();

    const [response] = useService(async () => {
        const queryParamsCodeGrant = queryString.parse(location.search) as CodeGrantQueryParams;
        if (queryParamsCodeGrant.code) {
            const exchangeCodeResponse = await exchangeAuthorizationCodeForToken(queryParamsCodeGrant.code);
            if (isSuccess(exchangeCodeResponse)) {
                const { refresh_token, id_token, access_token } = exchangeCodeResponse.data;
                if (refresh_token) {
                    setRefreshToken(refresh_token);
                }
                if (id_token) {
                    setIdToken(id_token);
                }
                setToken(access_token);
                const state = parseOAuthState(queryParamsCodeGrant.state as string | undefined);

                return success(state.nextUrl ?? '/');
            }

            return exchangeCodeResponse;
        } else {
            return failure<FetchError>({ message: 'Auth Code is not provided' });
        }
    });

    return (
        <RenderRemoteData remoteData={response} renderLoading={() => <Spinner />}>
            {(nextUrl) => <Navigate to={nextUrl} replace={true} />}
        </RenderRemoteData>
    );
}
