import { service } from 'aidbox-react/lib/services/service';
import { Token } from 'aidbox-react/lib/services/token';

import config from 'shared/src/config';
import { User } from 'shared/src/contrib/aidbox';

export interface OAuthState {
    nextUrl?: string;
}

export function parseOAuthState(state?: string): OAuthState {
    try {
        return state ? JSON.parse(atob(state)) : {};
    } catch {}

    return {};
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
        method: 'DELETE',
        url: '/Session',
    });
}

export function getUserInfo() {
    return service<User>({
        method: 'GET',
        url: '/auth/userinfo',
    });
}

export async function getJitsiAuthToken() {
    return service<{ jwt: string }>({
        method: 'POST',
        url: '/auth/$jitsi-token',
    });
}
