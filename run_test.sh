#!/bin/sh

if [ -f ".env.test.local" ]; then
    export `cat .env.test.local`
fi

if [ -z "${TESTS_AIDBOX_LICENSE_KEY}" ]; then
    echo "TESTS_AIDBOX_LICENSE_KEY is required to run tests"
    exit 1
fi

if [ -z "${TESTS_AIDBOX_LICENSE_ID}" ]; then
    echo "TESTS_AIDBOX_LICENSE_ID is required to run tests"
    exit 1
fi

if [ -z "${TESTS_BACKEND_IMAGE}" ]; then
    echo "TESTS_BACKEND_IMAGE is required to run tests"
    exit 1
fi

docker-compose -f docker-compose.tests.yaml pull
docker-compose -f docker-compose.tests.yaml up --exit-code-from dockerize dockerize || exit 1

if [ -z "$CI" ]; then
    yarn test $@ --runInBand
else
    docker-compose -f docker-compose.tests.yaml -f docker-compose.ci.yaml up --exit-code-from frontend frontend
fi
exit $?
