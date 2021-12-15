## Local setup

In the project we have three environments:

-   develop
-   staging
-   production

Local environment is required for developing. Before you start, run:

```
cp shared/src/config.local.ts shared/src/config.ts
```

This file (`shared/src/config.ts`) is ignored by git. So, feel free to change it.

### Install

```sh
yarn
cd mobile/ios
pod install
cd ../..
```

### Start

```sh
yarn start           # start watch all workspaces
yarn start:web       # start watch web workspace
yarn start:mobile    # start watch mobile workspace
```

### Test

```sh
yarn test            # launch tests for all workspaces
yarn test:web        # launch tests for web workspace
yarn test:mobile     # launch tests for mobile workspace
```

### Dependencies

To update dependeny make proper changes in all workspaces in `package.json` files and run `yarn` from the root.  
Make sure that you use the same version of most of libraries (especially react/react-native/react-dom).

## CI/CD setup

See [mobile/README.md](mobile/README.md) for mobile CI/CD setup using bitrise.

CI/CD for whole monorepo is already set up using .gitlab-ci.yml. You need only to set CI/CD variables:

-   TESTS_AIDBOX_LICENSE_ID
-   TESTS_AIDBOX_LICENSE_KEY
-   TESTS_BACKEND_IMAGE_REPOSITORY (something like registry.beda.software/YOUR_PROJECT/backend)
-   KUBE_INGRESS_BASE_DOMAIN (something like YOUR_PROJECT.beda.software)
-   K8S_CONFIG - textual representation of config (save it as a var)
-   BITRISE_APP_ID (see [mobile/README.md](mobile/README.md))
-   BITRISE_TRIGGER_BUILD_TOKEN (see [mobile/README.md](mobile/README.md))

**Note:** backend image repository should be in one group along with monorepo

Before first deploy:

1. fill shared/src/config.TIER.ts with needed settings
2. create namespace `YOUR_PROJECT-REPOSITORY_NAME-TIER-web` for each tier, where `YOUR_PROJECT` is the name of the group in gitlab, `REPOSITORY_NAME` is the name of this repository (default is frontend) and `TIER` is develop/staging/production.
3. Create deploy token in gitlab for each tier
4. Run command

```
kubectl -n YOUR_PROJECT-REPOSITORY_NAME-TIER-web create secret docker-registry gitlab-registry --docker-username=TOKEN_USERNAME --docker-password=TOKEN_PASSWORD --docker-email=YOUR_EMAIL --docker-server=registry.beda.software
```

for each namespace

As a result, your site will be accesible via `web.TIER.KUBE_INGRESS_BASE_DOMAIN`, for example `web.develop.example.beda.software`

## Push notifications

Mobile template includes setup for push notifications. To finish up setup:

-   On ios use your developer certificate

-   On android you need to configure google-services.json. See https://firebase.google.com/docs/android/setup for details

## Generators

To avoid writing boilerplate code we have [yeoman](https://github.com/yeoman/yo) generator [generator-beda](https://github.com/beda-software/frontend-beda-software-stack/tree/master/generator-beda).

To install run:

```
yarn global add yo
yarn global add generator-beda
```

It will install `yo` globally.

To use run

`yo beda:rn-container`

and answer questions.

In the future we'll provide more generators.
