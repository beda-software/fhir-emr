import {
    service as aidboxService,
    axiosInstance,
    setInstanceToken,
    resetInstanceToken,
    setInstanceBaseURL,
} from 'aidbox-react';
import type { AxiosRequestConfig } from 'axios';

import { initServicesFromService } from '@beda.software/fhir-react';
import { RemoteDataResult } from '@beda.software/remote-data';

const fhirService = async <S = any, F = any>(config: AxiosRequestConfig): Promise<RemoteDataResult<S, F>> => {
    return aidboxService({ ...config, baseURL: axiosInstance.defaults.baseURL + '/fhir' });
};

export const {
    createFHIRResource: aidboxCreateFHIRResource,
    updateFHIRResource: aidboxUpdateFHIRResource,
    getFHIRResource: aidboxGetFHIRResource,
    getFHIRResources: aidboxGetFHIRResources,
    getAllFHIRResources: aidboxGetAllFHIRResources,
    findFHIRResource: aidboxFindFHIRResource,
    saveFHIRResource: aidboxSaveFHIRResource,
    saveFHIRResources: aidboxSaveFHIRResources,
    patchFHIRResource: aidboxpatchFHIRResource,
    deleteFHIRResource: aidboxDeleteFHIRResource,
    forceDeleteFHIRResource: aidboxForceDeleteFHIRResource,
    getConcepts: aidboxGetConcepts,
    applyFHIRService: aidboxApplyFHIRService,
    applyFHIRServices: aidboxApplyFHIRServices,
} = initServicesFromService(aidboxService);

export const {
    createFHIRResource,
    updateFHIRResource,
    getFHIRResource,
    getFHIRResources,
    getAllFHIRResources,
    findFHIRResource,
    saveFHIRResource,
    saveFHIRResources,
    patchFHIRResource,
    deleteFHIRResource,
    forceDeleteFHIRResource,
    getConcepts,
    applyFHIRService,
    applyFHIRServices,
    service,
} = initServicesFromService(fhirService);

export { aidboxService, axiosInstance, setInstanceToken, resetInstanceToken, setInstanceBaseURL };
