# Token Refresh: enabling it in a consuming app

fhir-emr can silently renew a Session's access token when the server rejects it with a 401, then replay the failed request. Whether that happens is decided by your Aidbox login `Client`, not by app configuration. Without the setup below the app still works: it ends the Session with an Expired Sign-Out instead.

## Client attributes that turn it on

The login Client (the one named by `clientId` in your app config) must use the authorization code grant (PKCE) with access-token expiry and refresh enabled:

```yaml
resourceType: Client
id: my-code-client
first_party: true
grant_types:
    - authorization_code
auth:
    authorization_code:
        redirect_uri: 'https://my-app.example/auth'
        pkce: true
        secret_required: false
        refresh_token: true
        access_token_expiration: 3600 # seconds
        refresh_token_expiration: 86400 # seconds
```

`access_token_expiration`, `refresh_token_expiration` and `refresh_token: true` are all needed. Working examples: `resources/demo-seeds/Client/web-code.yaml` (60 s / 300 s lifetimes) for the demo stack, and the test-only `resources/test-seeds/Client/testAuthRefresh.yaml` (4 s / 10 s).

Pick `refresh_token_expiration` no shorter than the longest gap between two refreshes you want to survive (the longest stretch with no request at all, since the access token must also have expired for a refresh to happen): once it passes without a refresh, refresh is rejected and the provider is signed out. The window restarts at every successful refresh.

## App setup for the code flow

1. Set `authFlow: 'code'` in the app config, with `clientId` naming the code-grant Client, `authTokenPath: 'auth/token'` and `authClientRedirectURL` (the redirect URI). Both paths are required; see `docs/code-grant-sign-in.md`.
2. Nothing to mount: the built-in callback route exchanges the code when `authFlow` is `'code'`.

The refresh request goes to `authTokenPath`. The refresh credential is stored at sign-in and replaces nothing on refresh. Expired refresh credential, Idle Timeout precedence and "refresh is not Provider Activity" behave as described below.

## Password grant alternative

A Client with the password grant refreshes the same way, with the same three attributes under `auth.password`:

```yaml
resourceType: Client
id: my-login-client
grant_types:
    - password
secret: '<secret>'
auth:
    password:
        access_token_expiration: 3600 # seconds
        refresh_token_expiration: 86400 # seconds
        refresh_token: true
```

## The implicit flow cannot refresh

Aidbox rejects `refresh_token` and `refresh_token_expiration` under the `auth` block of a Client that uses the implicit grant (`unknown-key`), and issues only an access token. `access_token_expiration` is accepted and fixes that token's lifetime. A consumer that needs Token Refresh must use the code flow (or the password grant); with the implicit flow the app ends the Session with an Expired Sign-Out when the token is rejected.

| Grant                | Valid `auth.<grant>` attributes for refresh                                  |
| -------------------- | ---------------------------------------------------------------------------- |
| `password`           | `access_token_expiration`, `refresh_token_expiration`, `refresh_token: true` |
| `authorization_code` | `redirect_uri`, `pkce`, `secret_required`, plus the same three               |
| `implicit`           | `redirect_uri`, `access_token_expiration` only (no refresh attributes)       |

## Behaviour with and without a refresh credential

| Client issues a refresh token | Server rejects the access token (401) | Result                                                                    |
| ----------------------------- | ------------------------------------- | ------------------------------------------------------------------------- |
| Yes                           | Idle Timeout not elapsed              | Token Refresh, the request is replayed once, the provider notices nothing |
| Yes                           | Refresh rejected or unreachable       | Expired Sign-Out                                                          |
| No (default login Client)     | any                                   | Expired Sign-Out, no refresh attempted                                    |
| any                           | Idle Timeout already elapsed          | Forced Sign-Out; refresh is never attempted                               |

The Idle Timeout is opt-in: neither `App` nor `EMR` mounts it. Mounting it is what turns it on. Render it once, next to (and before) `App` or `EMR`, with the durations in seconds:

```tsx
import { App } from '@beda.software/emr/containers';
import { IdleTimeout } from '@beda.software/emr/components';

<>
    <IdleTimeout idleTimeoutSeconds={30 * 60} warningWindowSeconds={2 * 60} />
    <App />
</>;
```

`idleTimeoutSeconds` is required and must be a positive number, or the component throws. `warningWindowSeconds` defaults to 120, and is capped at half of `idleTimeoutSeconds` when it isn't shorter. Both are read once at mount; remount with a `key` to change them. It renders nothing when no one is signed in, and needs no router. While it is off, the "Idle Timeout already elapsed" row never applies.

A Client without the attributes above (for example the default `testAuth`) issues no `refresh_token` and no `expires_in`, and its tokens never expire server-side. Upgrading fhir-emr therefore changes nothing for it.

### Reloading the page

The same rules apply when the Session is restored on page load. If the stored access token is rejected with a 401 and the Client issued a refresh token, the app makes one Token Refresh and retries the restore once, so a reload (or a stale tab) after the access token expired keeps the provider signed in. If the refresh is rejected, or the retry is still rejected, the provider gets an Expired Sign-Out; if the Idle Timeout has already elapsed, a Forced Sign-Out with no refresh attempt. Without a refresh credential, a rejected token on reload also ends in an Expired Sign-Out. If the refresh fails because of a network error (or a 5xx), the stored credentials are kept, so the next load can retry. The refresh on reload is not Provider Activity.

### Requests made before EMR mounts

`EMR` installs the interceptor when it mounts, so a request the app sends before rendering `EMR` (for example its own `/auth/userinfo` load) is not covered. Such an app installs it first:

```ts
import config from '@beda.software/emr-config';
import { isIdleTimeoutElapsedNow } from '@beda.software/emr/dist/components/IdleTimeout/utils';
import {
    axiosInstance,
    doLogout,
    getToken,
    installSessionRejectionInterceptor,
    refreshSession,
} from '@beda.software/emr/services';

installSessionRejectionInterceptor(axiosInstance, {
    baseURL: config.baseURL,
    getToken,
    isIdleTimeoutElapsed: isIdleTimeoutElapsedNow,
    endSession: doLogout,
    refreshSession,
});
```

A client gets one interceptor however many times it is installed; `EMR` reuses the earlier one, and the first installation's options apply. Install it at startup or before `EMR` renders, not in an effect of a component that already renders `EMR`: React runs `EMR`'s effects first, so `EMR` would install it with its own options.

## What refresh does not do

-   **Reactive only.** Refresh runs only in response to a 401 on a request (including the Session restore on page load). There is no timer and no proactive renewal.
-   **Never extends an idle Session.** Refresh does not count as Provider Activity and does not touch the last-activity timestamp. The Idle Timeout stays the only authority for ending an idle Session.
-   **The access token does not slide; the refresh token does.** Aidbox fixes the access token's expiry at issue time, and using it does not extend it. The refresh token's lifetime is counted from issue or from its last use (checked on Aidbox with a 20 s lifetime: an unused token was rejected after 24 s, a token used every 12 s kept working past 36 s, and was rejected after 22 s idle). A provider who keeps working is renewed each time the access token dies and the refresh window restarts; one who is away longer than `refresh_token_expiration` is signed out.
-   Only the app's shared HTTP client is covered (not the fhir-react instance, value-set clients or raw `fetch` callers).

## Verifying your Aidbox

Checked against Aidbox 2607.5. Replace the host, client id and credentials with yours.

1. Sign in through the app and capture the code exchange (or repeat it by hand, with the `code` and `code_verifier` from a sign-in). The response must contain both `refresh_token` and `expires_in`:

    ```sh
    curl -s -X POST "$AIDBOX/auth/token" -H 'Content-Type: application/json' -d '{
      "grant_type": "authorization_code", "client_id": "my-code-client",
      "code": "<code>", "code_verifier": "<code_verifier>", "redirect_uri": "<redirect_uri>"
    }'
    ```

    The `code_verifier` must match the `code_challenge` sent to `/auth/authorize`. If `refresh_token` or `expires_in` is missing, the Client attributes are not applied and the app will fall back to Expired Sign-Out. For a password-grant Client, request the token with `"grant_type": "password"`, `client_id`, `client_secret`, `username` and `password` instead.

2. Exchange the refresh token. The response should contain `access_token`, `token_type` and `expires_in` only (no new refresh token, no user info):

    ```sh
    curl -s -X POST "$AIDBOX/auth/token" -H 'Content-Type: application/json' -d '{
      "grant_type": "refresh_token", "client_id": "my-code-client", "refresh_token": "<refresh_token>"
    }'
    ```

3. Use the original access token after `access_token_expiration` seconds: Aidbox returns 401 (calling it repeatedly before then must not have extended it).

## Overriding the sign-out texts

Every Session-ending text is overridden from one place: wrap `App` (or `EMR`) in `SignOutTextsContext.Provider`. Any field left out keeps its default, translated text.

```tsx
import { SignOutTextsContext } from '@beda.software/emr/components';

<SignOutTextsContext.Provider
    value={{
        warningWindow: { title: 'Still there?', stayLabel: 'Keep working' },
        forcedSignOutMessage: 'You were signed out after a period of inactivity.',
        expiredSignOutMessage: 'Your session is no longer valid. Please sign in again.',
    }}
>
    <App />
</SignOutTextsContext.Provider>;
```

`warningWindow` takes `title`, `body`, `stayLabel` and `signOutLabel`. The two messages are shown on the sign-in screen after a Forced Sign-Out and an Expired Sign-Out respectively; the sign-in page itself takes no props for them.
