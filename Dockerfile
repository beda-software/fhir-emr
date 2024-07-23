FROM node:lts as builder

RUN mkdir -p /app/src
RUN mkdir -p /app/shared

WORKDIR /app

ADD package.json package.json
ADD yarn.lock yarn.lock

RUN yarn install

ADD . /app

ARG TIER
RUN cp contrib/emr-config/config.${TIER}.js contrib/emr-config/config.js
RUN cp public/index.${TIER}.html public/index.html

RUN yarn compile
RUN yarn build
