#!/bin/sh

docker pull bedasoftware/kaitenzushi:latest

docker run -d --name fhir-emr-kaitenzushi \
    -v $(pwd)/resources:/app/resources \
    bedasoftware/kaitenzushi:latest \
    -i resources/tests/TestScript \
    -o resources/tests/TestScript \
    -d https://github.com/beda-software/beda-emr-core

CONTAINER_EXIT_CODE=$(docker wait fhir-emr-kaitenzushi)

docker rm fhir-emr-kaitenzushi

exit $CONTAINER_EXIT_CODE