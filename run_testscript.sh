#!/bin/sh

if [ -f ".env" ]; then
    export `cat .env`
fi

docker compose -f docker-compose.testscript.yaml up -d

docker-compose -f docker-compose.testscript.yaml exec -it testscript pytest
docker compose -f docker-compose.testscript.yaml pull --quite
exit $?
