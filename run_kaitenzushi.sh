#!/bin/sh

docker pull bedasoftware/kaitenzushi:main

docker run -d --name fhir-emr-kaitenzushi \
    -v $(pwd)/resources:/app/resources \
    bedasoftware/kaitenzushi:main \
    -i resources/tests/TestScript -o resources/tests/TestScript

CONTAINER_EXIT_CODE=$(docker wait fhir-emr-kaitenzushi)

docker rm fhir-emr-kaitenzushi

exit $CONTAINER_EXIT_CODE