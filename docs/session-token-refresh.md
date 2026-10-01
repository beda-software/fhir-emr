# Token Refresh: enabling it in a consuming app

fhir-emr can silently renew a Session's access token when the server rejects it with a 401, then replay the failed request. Whether that happens is decided by your Aidbox login `Client`, not by app configuration. Without the setup below the app still works: it ends the Session with an Expired Sign-Out instead.

## Client attributes that turn it on

The login Client (the one named by `clientId` in your app config) must use the password grant (or the code flow, see below) with access-token expiry and refresh enabled:

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

All three `auth.password` attributes are needed. The repo's `resources/init-seeds/Client/testAuthRefresh.yaml` is a working example with very short lifetimes (4 s / 10 s), meant for tests.

Pick `refresh_token_expiration` no shorter than the longest working day you want to survive: once it passes, refresh is rejected and the provider is signed out.

## Code flow (PKCE) opt-in

The password grant is not the only way to get refresh. A Session signed in through the authorization code flow refreshes the same way. To opt in:

1. Set `authFlow: 'code'` in the app config, with `clientId` naming a code-grant Client, `authTokenPath: 'auth/token'` and `authClientRedirectURL` (the redirect URI). Both paths are required; see `docs/code-grant-sign-in.md`.
2. Use a Client with the `authorization_code` grant and refresh enabled. `resources/init-seeds/Client/web-code.yaml` is a working example (60 s / 300 s lifetimes, for tests):

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

3. Mount `CodeGrantAuth` on the redirect route yourself. If it is not mounted, the provider returns from Aidbox to a route that never exchanges the code: no token or refresh credential is stored and sign-in does not complete.

In code mode the refresh request goes to `authTokenPath`. The refresh credential is stored at sign-in and replaces nothing on refresh, exactly as in the password grant. Expired refresh credential, Idle Timeout precedence and "refresh is not Provider Activity" behave as described below.

## The implicit flow cannot refresh

Aidbox rejects `refresh_token`, `access_token_expiration` and `refresh_token_expiration` under the `auth` block of a Client that uses the implicit grant, and issues only an access token. A consumer that needs Token Refresh must use the code flow or the password grant; with the implicit flow the app ends the Session with an Expired Sign-Out when the token is rejected.

| Grant                | Valid `auth.<grant>` attributes for refresh                                  |
| -------------------- | ---------------------------------------------------------------------------- |
| `password`           | `access_token_expiration`, `refresh_token_expiration`, `refresh_token: true` |
| `authorization_code` | `redirect_uri`, `pkce`, `secret_required`, plus the same three               |
| `implicit`           | none (no refresh attributes accepted)                                        |

## Behaviour with and without a refresh credential

| Client issues a refresh token | Server rejects the access token (401) | Result                                                                    |
| ----------------------------- | ------------------------------------- | ------------------------------------------------------------------------- |
| Yes                           | Idle Timeout not elapsed              | Token Refresh, the request is replayed once, the provider notices nothing |
| Yes                           | Refresh rejected or unreachable       | Expired Sign-Out                                                          |
| No (default login Client)     | any                                   | Expired Sign-Out, no refresh attempted                                    |
| any                           | Idle Timeout already elapsed          | Forced Sign-Out; refresh is never attempted                               |

A Client without the attributes above (for example the default `testAuth`) issues no `refresh_token` and no `expires_in`, and its tokens never expire server-side. Upgrading fhir-emr therefore changes nothing for it.

## What refresh does not do

-   **Reactive only.** Refresh runs only in response to a 401 on a request. There is no timer and no proactive renewal.
-   **Never extends an idle Session.** Refresh does not count as Provider Activity and does not touch the last-activity timestamp. The Idle Timeout stays the only authority for ending an idle Session.
-   **Expiry does not slide.** Aidbox fixes token expiry at issue time; using a token does not extend it. A provider working continuously is renewed when the access token dies, and signed out when the refresh token dies.
-   Only the app's shared HTTP client is covered (not the fhir-react instance, value-set clients or raw `fetch` callers).

## Verifying your Aidbox

Checked against Aidbox 2607.5. Replace the host, client id and credentials with yours.

1. Request a token and confirm the response contains both `refresh_token` and `expires_in`:

    ```sh
    curl -s -X POST "$AIDBOX/auth/token" -H 'Content-Type: application/json' -d '{
      "grant_type": "password", "client_id": "my-login-client", "client_secret": "<secret>",
      "username": "<user>", "password": "<password>"
    }'
    ```

    If either is missing, the Client attributes are not applied and the app will fall back to Expired Sign-Out.

2. Exchange the refresh token. The response should contain `access_token`, `token_type` and `expires_in` only (no new refresh token, no user info):

    ```sh
    curl -s -X POST "$AIDBOX/auth/token" -H 'Content-Type: application/json' -d '{
      "grant_type": "refresh_token", "client_id": "my-login-client", "refresh_token": "<refresh_token>"
    }'
    ```

3. Code flow only: the token response from the code exchange must also contain `refresh_token` and `expires_in`. Exchange the code with the `code_verifier` that matches the `code_challenge` sent to `/auth/authorize`; step 2 then works unchanged with your code Client's id.

4. Use the original access token after `access_token_expiration` seconds: Aidbox returns 401 (calling it repeatedly before then must not have extended it).

Background and raw findings: `docs/research/session-management-via-interceptors.md`, section 8.

## Overriding the sign-out texts

Every Session-ending text is overridden from one place: the `signOutTexts` prop of `EMR` (or of `App`, which forwards it). Any field left out keeps its default, translated text.

```tsx
<App
    signOutTexts={{
        warningWindow: { title: 'Still there?', stayLabel: 'Keep working' },
        forcedSignOutMessage: 'You were signed out after a period of inactivity.',
        expiredSignOutMessage: 'Your session is no longer valid. Please sign in again.',
    }}
/>
```

`warningWindow` takes `title`, `body`, `stayLabel` and `signOutLabel`. The two messages are shown on the sign-in screen after a Forced Sign-Out and an Expired Sign-Out respectively; the sign-in page itself takes no props for them.
