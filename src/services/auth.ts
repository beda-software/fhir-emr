import { decodeJwt } from 'jose';

import {
    setInstanceToken as setAidboxInstanceToken,
    resetInstanceToken as resetAidboxInstanceToken,
} from 'aidbox-react/lib/services/instance';
import { service } from 'aidbox-react/lib/services/service';
import { Token } from 'aidbox-react/lib/services/token';

import { User } from '@beda.software/aidbox-types';
import config from '@beda.software/emr-config';
import { serviceFetch, isSuccess, RemoteDataResult, failure, FetchError } from '@beda.software/remote-data';

import {
    setInstanceToken as setFHIRInstanceToken,
    resetInstanceToken as resetFHIRInstanceToken,
} from 'src/services/fhir';

export interface OAuthState {
    nextUrl?: string;
}

export interface AuthTokenResponse {
    access_token: string;
    refresh_token?: string;
    id_token?: string;
}

export interface GetAuthorizeUrlArgs {
    authPath: string;
    params: URLSearchParams;
    baseUrl?: string;
    state?: OAuthState;
}

export function parseOAuthState(state?: string): OAuthState {
    try {
        return state ? JSON.parse(atob(state)) : {};
    } catch {
        return {};
    }
}

export function formatOAuthState(state: OAuthState) {
    return btoa(JSON.stringify(state));
}

export function getAuthorizeUrl(args: GetAuthorizeUrlArgs) {
    const stateStr = args.state ? `&state=${formatOAuthState(args.state)}` : '';
    const url = `${args.baseUrl ?? config.baseURL}/${args.authPath}?${args.params}`;

    return `${url}${stateStr}`;
}

export function getToken() {
    return window.localStorage.getItem('token') || undefined;
}

export function setToken(token: string) {
    window.localStorage.setItem('token', token);
}

export function removeToken() {
    window.localStorage.removeItem('token');
}

export function setRefreshToken(token: string) {
    window.localStorage.setItem('refresh_token', token);
}

export function setIdToken(value: string) {
    window.localStorage.setItem('id_token', value);
}

export function getIdToken() {
    return window.localStorage.getItem('id_token');
}

export function setAuthTokenURLpath(value: string) {
    window.localStorage.setItem('auth_token_path', value);
}

export function getAuthTokenURLpath() {
    return window.localStorage.getItem('auth_token_path');
}

export function setAuthClientRedirectURL(value: string) {
    window.localStorage.setItem('auth_client_redirect_url', value);
}

export function getAuthClientRedirectURL() {
    return window.localStorage.getItem('auth_client_redirect_url');
}

interface LoginBody {
    email: string;
    password: string;
}

type TokenResponse = {
    userinfo: User;
} & Token;

export async function login(data: LoginBody) {
    return await service<TokenResponse>({
        baseURL: config.baseURL,
        url: '/auth/token',
        method: 'POST',
        data: {
            username: data.email,
            password: data.password,
            client_id: 'testAuth',
            client_secret: '123456',
            grant_type: 'password',
        },
    });
}

export function logout() {
    return service({
        baseURL: config.baseURL,
        method: 'DELETE',
        url: '/Session',
    });
}

export async function doLogout() {
    await logout();
    resetAidboxInstanceToken();
    resetFHIRInstanceToken();
    localStorage.clear();
    window.location.href = '/';
}

export function getUserInfo() {
    return service<User>({
        baseURL: config.baseURL,
        method: 'GET',
        url: '/auth/userinfo',
    });
}

export async function getJitsiAuthToken() {
    return service<{ jwt: string }>({
        baseURL: config.baseURL,
        method: 'POST',
        url: '/auth/$jitsi-token',
    });
}

export async function signinWithIdentityToken(
    user: { firstName: string; lastName: string } | undefined,
    identityToken: string,
): Promise<RemoteDataResult> {
    const authTokenResponse = await getAuthToken(identityToken);

    if (isSuccess(authTokenResponse)) {
        const authToken = authTokenResponse.data.access_token;
        setToken(authToken);
        setAidboxInstanceToken({ access_token: authToken, token_type: 'Bearer' });
        setFHIRInstanceToken({ access_token: authToken, token_type: 'Bearer' });

        return await service({
            method: 'POST',
            url: '/Questionnaire/federated-identity-signin/$extract',
            data: {
                resourceType: 'Parameters',
                parameter: [
                    {
                        name: 'FederatedIdentity',
                        value: {
                            Identifier: {
                                system: decodeJwt(identityToken).iss,
                                value: decodeJwt(identityToken).sub,
                            },
                        },
                    },
                    {
                        name: 'questionnaire_response',
                        resource: {
                            resourceType: 'QuestionnaireResponse',
                            questionnaire: 'federated-identity-signin',
                            item: [
                                {
                                    linkId: 'firstname',
                                    answer: [{ valueString: user?.firstName }],
                                },
                                {
                                    linkId: 'lastname',
                                    answer: [{ valueString: user?.lastName }],
                                },
                            ],
                        },
                    },
                ],
            },
        });
    } else {
        return authTokenResponse;
    }
}

async function getAuthToken(appleToken: string) {
    return await serviceFetch<AuthTokenResponse>(`${config.wearablesDataStreamService}/auth/token`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${appleToken}` },
    });
}

export async function exchangeAuthorizationCodeForToken(code: string) {
    const tokenPath = config.authTokenPath;
    if (tokenPath === undefined) {
        return failure<FetchError>({ message: 'authTokenPath is not configured in emr-config package' });
    }
    const redirectURL = config.authClientRedirectURL;
    if (redirectURL === undefined) {
        return failure<FetchError>({ message: 'authClientRedirectURL is not configured in emr-config package' });
    }

    const tokenEndpoint = `${config.baseURL}/${tokenPath}`;
    const data = {
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectURL,
        client_id: `${config.clientId}`,
    };

    return await serviceFetch<AuthTokenResponse>(tokenEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(data),
    });
}
