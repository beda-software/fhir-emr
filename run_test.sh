#!/bin/sh

if [ -f ".env" ]; then
    export `cat .env`
fi

docker compose -f docker-compose.tests.yaml pull --quite
docker compose -f docker-compose.tests.yaml up -d

yarn test
exit $?
