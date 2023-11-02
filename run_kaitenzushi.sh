#!/bin/sh

docker pull bedasoftware/kaitenzushi:develop

docker run -d --name fhir-emr-kaitenzushi \
    -v $(pwd)/resources:/app/resources \
    bedasoftware/kaitenzushi:develop

CONTAINER_EXIT_CODE=$(docker wait fhir-emr-kaitenzushi)

docker rm fhir-emr-kaitenzushi

exit $CONTAINER_EXIT_CODE