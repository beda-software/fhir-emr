#!/bin/sh

docker compose -f docker-compose.kaitenzushi.yaml pull --quite
docker compose -f docker-compose.kaitenzushi.yaml up --exit-code-from kaitenzushi kaitenzushi
exit $?
