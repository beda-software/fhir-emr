import { service as aidboxService } from 'aidbox-react';
import type { AxiosRequestConfig } from 'axios';

import config from '@beda.software/emr-config';
import { RemoteDataResult } from '@beda.software/remote-data';

export const aiService = async <S = any, F = any>(axiosConfig: AxiosRequestConfig): Promise<RemoteDataResult<S, F>> => {
    return aidboxService({ ...axiosConfig, baseURL: config.aiAssistantServiceUrl });
};
