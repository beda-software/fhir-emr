#!/bin/sh

if [ -f ".env" ]; then
    export `cat .env`
fi

if [ -z "${TESTS_AIDBOX_LICENSE_KEY}" ]; then
    echo "TESTS_AIDBOX_LICENSE_KEY is required to run tests"
    exit 1
fi

if [ -z "${TESTS_AIDBOX_LICENSE_ID}" ]; then
    echo "TESTS_AIDBOX_LICENSE_ID is required to run tests"
    exit 1
fi

export TEST_COMMAND=" wait-for-it.sh devbox:8080 --strict --timeout=0 -- pipenv run pytest --junitxml=report.xml --cov-report html --cov-report term:skip-covered --doctest-modules --cov app ${@:-tests/}"
docker-compose -f docker-compose.tests.yaml up --exit-code-from dockerize dockerize || exit 1
docker-compose -f docker-compose.tests.yaml up --exit-code-from backend backend
exit $?
