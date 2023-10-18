#!/bin/sh

if [ -f ".env" ]; then
    export `cat .env`
fi

docker compose -f docker-compose.testscript.yaml pull
docker compose -f docker-compose.testscript.yaml up -d

docker-compose -f docker-compose.testscript.yaml exec -it testscript pytest
exit $?
