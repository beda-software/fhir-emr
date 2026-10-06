import axios from 'axios';
import { decodeJwt } from 'jose';

import { User } from '@beda.software/aidbox-types';
import config from '@beda.software/emr-config';
import {
    serviceFetch,
    isSuccess,
    RemoteDataResult,
    failure,
    success,
    FetchError,
    Token,
} from '@beda.software/remote-data';

import { aidboxService, resetInstanceToken, setInstanceToken } from 'src/services/fhir';
import {
    clearCodeVerifier,
    createCodeChallenge,
    createCodeVerifier,
    getCodeVerifier,
    saveCodeVerifier,
} from 'src/services/pkce';

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
    return await aidboxService<TokenResponse>({
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
    return aidboxService({
        baseURL: config.baseURL,
        method: 'DELETE',
        url: '/Session',
    });
}

export interface RefreshSessionDeps {
    getRefreshToken: () => string | undefined | null;
    saveAccessToken: (accessToken: string) => void;
    clientId: string;
    baseURL: string;
    tokenPath?: string;
}

// Bypasses the shared HTTP client so it cannot re-enter the interceptor. Aidbox answers with a new
// access token only, so the refresh credential and everything else stored at sign-in stay as they are.
export function createRefreshSession(deps: RefreshSessionDeps): () => Promise<string | undefined> {
    return async () => {
        const refreshToken = deps.getRefreshToken();

        if (!refreshToken) {
            return undefined;
        }

        const response = await axios.post<{ access_token: string }>(
            `${deps.baseURL}/${deps.tokenPath ?? 'auth/token'}`,
            {
                grant_type: 'refresh_token',
                client_id: deps.clientId,
                refresh_token: refreshToken,
            },
        );
        const accessToken = response.data.access_token;
        deps.saveAccessToken(accessToken);

        return accessToken;
    };
}

let refreshInFlight: Promise<string | undefined> | undefined;

// Concurrent callers (Session restore, interceptor 401s) share one request.
export function refreshSession(): Promise<string | undefined> {
    refreshInFlight ??= createRefreshSession({
        getRefreshToken: () => window.localStorage.getItem('refresh_token'),
        saveAccessToken: (accessToken) => {
            setToken(accessToken);
            setInstanceToken({ access_token: accessToken, token_type: 'Bearer' });
        },
        clientId: config.clientId,
        baseURL: config.baseURL,
        tokenPath: getAuthFlow().refreshTokenPath(),
    })().finally(() => {
        refreshInFlight = undefined;
    });

    return refreshInFlight;
}

export type SignOutReason = 'manual' | 'expired';

const SIGN_IN_PATH = '/signin';

export interface SignInLocationState {
    signOutReason?: Exclude<SignOutReason, 'manual'>;
}

let endSessionInFlight: Promise<void> | undefined;

// The one end-of-session path for Manual and Expired Sign-Out. Concurrent
// calls share a single run, so the Session is only ever ended once.
export function doLogout(reason: SignOutReason): Promise<void> {
    endSessionInFlight ??= endSession(reason).finally(() => {
        endSessionInFlight = undefined;
    });

    return endSessionInFlight;
}

async function endSession(reason: SignOutReason) {
    try {
        await logout();
    } catch {
        // A dead token fails DELETE /Session with 401; that must never block sign-out.
    }
    resetInstanceToken();
    localStorage.clear();
    if (reason === 'manual') {
        window.location.href = '/';

        return;
    }
    // Router location state lives in history.state, which survives the reload that
    // resets the in-memory user and lets the router render the anonymous routes.
    const state: SignInLocationState = { signOutReason: reason };
    window.history.replaceState({ usr: state }, '', SIGN_IN_PATH);
    window.location.reload();
}

export function getUserInfo() {
    return aidboxService<User>({
        baseURL: config.baseURL,
        method: 'GET',
        url: '/auth/userinfo',
    });
}

export async function getJitsiAuthToken() {
    return aidboxService<{ jwt: string }>({
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
        setInstanceToken({ access_token: authToken, token_type: 'Bearer' });

        return await aidboxService({
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

interface AuthFlow {
    getSignInUrl(state?: OAuthState): Promise<RemoteDataResult<string>>;
    exchangeCode(tokenEndpoint: string, data: Record<string, string>): Promise<RemoteDataResult<AuthTokenResponse>>;
    refreshTokenPath(): string | undefined;
}

const implicitFlow: AuthFlow = {
    async getSignInUrl(state) {
        return success(
            getAuthorizeUrl({
                authPath: 'auth/authorize',
                params: new URLSearchParams({ client_id: config.clientId, response_type: 'token' }),
                state,
            }),
        );
    },
    exchangeCode: postAuthorizationCode,
    refreshTokenPath: () => undefined,
};

const codeFlow: AuthFlow = {
    async getSignInUrl(state) {
        if (config.authTokenPath === undefined) {
            return failure<FetchError>({ message: 'authTokenPath is not configured in emr-config package' });
        }
        if (config.authClientRedirectURL === undefined) {
            return failure<FetchError>({ message: 'authClientRedirectURL is not configured in emr-config package' });
        }

        const verifier = createCodeVerifier();
        const codeChallenge = await createCodeChallenge(verifier);
        saveCodeVerifier(verifier);

        return success(
            getAuthorizeUrl({
                authPath: 'auth/authorize',
                params: new URLSearchParams({
                    client_id: config.clientId,
                    response_type: 'code',
                    redirect_uri: config.authClientRedirectURL,
                    code_challenge: codeChallenge,
                    code_challenge_method: 'S256',
                }),
                state,
            }),
        );
    },
    async exchangeCode(tokenEndpoint, data) {
        const verifier = getCodeVerifier();
        if (verifier === undefined) {
            return failure<FetchError>({ message: 'PKCE code verifier is missing, please sign in again' });
        }

        try {
            return await postAuthorizationCode(tokenEndpoint, { ...data, code_verifier: verifier });
        } finally {
            clearCodeVerifier();
        }
    },
    refreshTokenPath: () => config.authTokenPath,
};

function getAuthFlow(): AuthFlow {
    return config.authFlow === 'code' ? codeFlow : implicitFlow;
}

export function getSignInUrl(state?: OAuthState): Promise<RemoteDataResult<string>> {
    return getAuthFlow().getSignInUrl(state);
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

    return getAuthFlow().exchangeCode(`${config.baseURL}/${tokenPath}`, {
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectURL,
        client_id: config.clientId,
    });
}

function postAuthorizationCode(tokenEndpoint: string, data: Record<string, string>) {
    return serviceFetch<AuthTokenResponse>(tokenEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(data),
    });
}
