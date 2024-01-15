import { initServices } from '@beda.software/fhir-react';

import config from 'shared/src/config';

export const {
    axiosInstance,
    service,
    setInstanceToken,
    resetInstanceToken,
    getFHIRResource,
    getFHIRResources,
    getAllFHIRResources,
    saveFHIRResource,
    updateFHIRResource,
    createFHIRResource,
    forceDeleteFHIRResource,
    patchFHIRResource,
} = initServices(config.baseURL + '/fhir');
