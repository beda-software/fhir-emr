FROM node:lts as builder

RUN mkdir -p /app/web
RUN mkdir -p /app/mobile
RUN mkdir -p /app/shared

WORKDIR /app

ADD lerna.json lerna.json

ADD package.json package.json
ADD mobile/package.json mobile/package.json
ADD web/package.json web/package.json
ADD shared/package.json shared/package.json
ADD yarn.lock yarn.lock

RUN yarn --network-concurrency=1

ADD . /app

ARG TIER
RUN cp shared/src/config.${TIER}.ts shared/src/config.ts

RUN yarn build
