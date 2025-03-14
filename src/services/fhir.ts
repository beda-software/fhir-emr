import config from '@beda.software/emr-config';
import { initServices } from '@beda.software/fhir-react';

export const {
    axiosInstance,
    service,
    setInstanceToken,
    resetInstanceToken,
    getFHIRResource,
    getFHIRResources,
    getAllFHIRResources,
    saveFHIRResource,
    saveFHIRResources,
    updateFHIRResource,
    createFHIRResource,
    forceDeleteFHIRResource,
    patchFHIRResource,
    setInstanceBaseURL,
} = initServices(config.fhirBaseURL ? config.fhirBaseURL : config.baseURL + '/fhir');
