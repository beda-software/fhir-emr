import {
    service as aidboxService,
    axiosInstance,
    setInstanceToken,
    resetInstanceToken,
    setInstanceBaseURL,
} from 'aidbox-react';
import type { AxiosRequestConfig } from 'axios';

import { User } from '@beda.software/aidbox-types';
import { ensure, initServicesFromService } from '@beda.software/fhir-react';
import { RemoteData, RemoteDataResult, Token } from '@beda.software/remote-data';

export type LoginService = (user: User) => Promise<RemoteData<Token>>;

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

export async function getAidboxToken(user: User, loginService: LoginService): Promise<Token> {
    if (!user.email) {
        throw new Error('Can not login for user without an email');
    }

    const result = await loginService(user);

    return ensure(result);
}

export { aidboxService, axiosInstance, setInstanceToken, resetInstanceToken, setInstanceBaseURL };
