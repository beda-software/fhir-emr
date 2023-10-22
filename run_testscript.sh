#!/bin/sh

if [ -f ".env" ]; then
    export `cat .env`
fi

docker compose -f docker-compose.testscript.yaml pull --quite
docker compose -f docker-compose.testscript.yaml up --exit-code-from testscript testscript
exit $?
