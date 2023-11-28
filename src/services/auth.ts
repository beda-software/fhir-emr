import { decodeJwt } from 'jose';

import { setInstanceToken as setAidboxInstanceToken } from 'aidbox-react/lib/services/instance';
import { service } from 'aidbox-react/lib/services/service';
import { Token } from 'aidbox-react/lib/services/token';

import { isSuccess } from 'fhir-react/lib/libs/remoteData';
import { service as fetchService } from 'fhir-react/lib/services/fetch';
import { setInstanceToken as setFHIRInstanceToken } from 'fhir-react/lib/services/instance';

import config from 'shared/src/config';
import { User } from 'shared/src/contrib/aidbox';

export interface OAuthState {
    nextUrl?: string;
}

export interface AuthTokenResponse {
    access_token: string;
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

export function getAuthorizeUrl(state?: OAuthState) {
    const stateStr = state ? `&state=${formatOAuthState(state)}` : '';

    return `${config.baseURL}/auth/authorize?client_id=${config.clientId}&response_type=token${stateStr}`;
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
) {
    const authTokenResponse = await getAuthToken(identityToken);
    console.log('authTokenResponse', authTokenResponse);
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
    return await fetchService<AuthTokenResponse>(`${config.wearablesDataStreamService}/auth/token`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${appleToken}` },
    });
}
