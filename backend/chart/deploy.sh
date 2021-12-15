#!/bin/sh

mkdir -p /root/.kube/
echo "$K8S_CONFIG" > /root/.kube/config
export KUBECONFIG=/root/.kube/config
export NAMESPACE="fhir-emr-backend-${CI_COMMIT_REF_NAME}"
kubectl config use-context default
CI_ENVIRONMENT_SLUG="$CI_COMMIT_REF_SLUG"
helm upgrade --install \
        --wait \
        --namespace $NAMESPACE \
        --set service.enabled=true \
        --set gitlab.app="$CI_PROJECT_PATH_SLUG" \
        --set gitlab.env="$CI_ENVIRONMENT_SLUG" \
        --set releaseOverride="$CI_ENVIRONMENT_SLUG" \
        --set image.repository="$CI_REGISTRY_IMAGE" \
        --set image.tag="$CI_COMMIT_REF_SLUG" \
        --set image.hash="$1" \
        --set image.secrets[0].name=gitlab-registry \
        --set application.track="$CI_COMMIT_REF_NAME" \
        --set service.url="${CI_COMMIT_REF_NAME}-backend.fhir-emr.beda.software"\
        --set replicaCount=1 \
        "${CI_PROJECT_PATH_SLUG}-${CI_COMMIT_REF_NAME}" \
        .
