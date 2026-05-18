import type { AxiosRequestConfig } from 'axios';

import config from '@beda.software/emr-config';
import { RemoteDataResult } from '@beda.software/remote-data';

import { service } from 'src/services/fhir';

export const aiService = async <S = any, F = any>(axiosConfig: AxiosRequestConfig): Promise<RemoteDataResult<S, F>> => {
    return service({ ...axiosConfig, baseURL: config.aiAssistantServiceUrl });
};
