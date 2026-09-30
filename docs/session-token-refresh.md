# Token Refresh: enabling it in a consuming app

fhir-emr can silently renew a Session's access token when the server rejects it with a 401, then replay the failed request. Whether that happens is decided by your Aidbox login `Client`, not by app configuration. Without the setup below the app still works: it ends the Session with an Expired Sign-Out instead.

## Client attributes that turn it on

The login Client (the one named by `clientId` in your app config) must use the password grant with access-token expiry and refresh enabled:

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

## Behaviour with and without a refresh credential

| Client issues a refresh token | Server rejects the access token (401) | Result |
| --- | --- | --- |
| Yes | Idle Timeout not elapsed | Token Refresh, the request is replayed once, the provider notices nothing |
| Yes | Refresh rejected or unreachable | Expired Sign-Out |
| No (default login Client) | any | Expired Sign-Out, no refresh attempted |
| any | Idle Timeout already elapsed | Forced Sign-Out; refresh is never attempted |

A Client without the attributes above (for example the default `testAuth`) issues no `refresh_token` and no `expires_in`, and its tokens never expire server-side. Upgrading fhir-emr therefore changes nothing for it.

## What refresh does not do

- **Reactive only.** Refresh runs only in response to a 401 on a request. There is no timer and no proactive renewal.
- **Never extends an idle Session.** Refresh does not count as Provider Activity and does not touch the last-activity timestamp. The Idle Timeout stays the only authority for ending an idle Session.
- **Expiry does not slide.** Aidbox fixes token expiry at issue time; using a token does not extend it. A provider working continuously is renewed when the access token dies, and signed out when the refresh token dies.
- Only the app's shared HTTP client is covered (not the fhir-react instance, value-set clients or raw `fetch` callers).

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

3. Use the original access token after `access_token_expiration` seconds: Aidbox returns 401 (calling it repeatedly before then must not have extended it).

Background and raw findings: `docs/research/session-management-via-interceptors.md`, section 8.
