# FHIR EMR

Project for https://github.com/HealthSamurai/xmas-hackathon-2021

### Install
```sh
git submodule update --init
```

```sh
yarn
```

## Local setup
```
cp .env.tpl .env
```
Set aidbox license id and key in .env

```
cp shared/src/config.local.ts shared/src/config.ts
```

This file (`shared/src/config.ts`) is ignored by git. So, feel free to change it.

### Start

```sh
yarn start           # start watch all workspaces
```

### Test

```sh
yarn test            # launch tests for all workspaces
```

