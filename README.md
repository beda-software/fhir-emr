## Local setup

```
cp .env.tpl .env
```
Set aidbox license id and key in .env

```
cp shared/src/config.local.ts shared/src/config.ts
```

This file (`shared/src/config.ts`) is ignored by git. So, feel free to change it.

### Install

```sh
yarn
```

### Start

```sh
yarn start           # start watch all workspaces
```

### Test

```sh
yarn test            # launch tests for all workspaces
```

