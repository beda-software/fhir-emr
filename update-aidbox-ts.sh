#!/bin/sh

docker-compose -f docker-compose.yaml -f docker-compose.aidbox-ts.yaml run --rm aidbox-ts-generator
yarn run prettier --write shared/src/contrib/aidbox/index.ts
