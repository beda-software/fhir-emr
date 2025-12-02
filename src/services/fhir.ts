import {
    service as aidboxService,
    axiosInstance,
    setInstanceToken,
    resetInstanceToken,
    setInstanceBaseURL as setAidboxInstanceBaseURL,
} from 'aidbox-react';
import type { AxiosRequestConfig } from 'axios';

import config from '@beda.software/emr-config';
import { initServicesFromService } from '@beda.software/fhir-react';
import { RemoteDataResult } from '@beda.software/remote-data';

let fhirBaseURL: string | null = null;

function setInstanceBaseURL(baseURL: string) {
    fhirBaseURL = baseURL;
}

function getInstanceBaseURL() {
    if (fhirBaseURL) {
        return fhirBaseURL;
    }
    if (config.fhirBaseURL) {
        return config.fhirBaseURL;
    }

    return axiosInstance.defaults.baseURL + '/fhir';
}

const fhirService = async <S = any, F = any>(config: AxiosRequestConfig): Promise<RemoteDataResult<S, F>> => {
    return aidboxService({ ...config, baseURL: getInstanceBaseURL() });
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

export {
    aidboxService,
    axiosInstance,
    setInstanceToken,
    resetInstanceToken,
    setInstanceBaseURL,
    setAidboxInstanceBaseURL,
};
