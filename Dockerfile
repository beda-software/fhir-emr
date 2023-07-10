FROM node:lts as builder

RUN mkdir -p /app/src
RUN mkdir -p /app/shared

WORKDIR /app

ADD package.json package.json
ADD yarn.lock yarn.lock

RUN yarn --network-concurrency=1

ADD . /app

ARG TIER
RUN cp shared/src/config.${TIER}.ts shared/src/config.ts
RUN cp public/index.${TIER}.html public/index.html

RUN yarn compile
RUN yarn build
