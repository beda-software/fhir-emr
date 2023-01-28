#!/bin/sh

if [ -f ".env" ]; then
    export `cat .env`
fi

docker-compose -f docker-compose.tests.yaml pull
docker-compose -f docker-compose.tests.yaml up -d

yarn test $@ --runInBand
exit $?
