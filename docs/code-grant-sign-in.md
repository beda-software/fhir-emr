# Code-grant sign-in (PKCE): enabling it in a consuming app

By default providers sign in through the implicit flow. Set `authFlow: 'code'` in the app config to use the authorization code flow with PKCE instead.

```js
const config = {
  clientId: 'web-code',
  authFlow: 'code', // 'implicit' (default) | 'code'
  authTokenPath: 'auth/token',
  authClientRedirectURL: 'https://my-app.example/auth',
};
```

- `authTokenPath` and `authClientRedirectURL` are required in code mode. If either is missing, the sign-in page shows an error and does not redirect.
- Mount `CodeGrantAuth` on the redirect route yourself; this repo does not.
- The login `Client` must allow the authorization code grant with PKCE and no client secret. `resources/init-seeds/Client/web-code.yaml` is a working example with short lifetimes.
- The one-time verifier is kept in `sessionStorage` across the redirect and removed after the exchange, whether it succeeded or failed.
