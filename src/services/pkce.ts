const VERIFIER_STORAGE_KEY = 'pkce_code_verifier';

function base64UrlEncode(bytes: Uint8Array) {
    return btoa(String.fromCharCode(...bytes))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

export function createCodeVerifier() {
    return base64UrlEncode(crypto.getRandomValues(new Uint8Array(32)));
}

export async function createCodeChallenge(verifier: string) {
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));

    return base64UrlEncode(new Uint8Array(digest));
}

export function saveCodeVerifier(verifier: string) {
    window.sessionStorage.setItem(VERIFIER_STORAGE_KEY, verifier);
}

export function getCodeVerifier() {
    return window.sessionStorage.getItem(VERIFIER_STORAGE_KEY) ?? undefined;
}

export function clearCodeVerifier() {
    window.sessionStorage.removeItem(VERIFIER_STORAGE_KEY);
}
