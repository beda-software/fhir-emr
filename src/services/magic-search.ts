import config from '@beda.software/emr-config';

import { getToken } from 'src/services/auth.ts';
import { service } from 'src/services/fhir.ts';

export interface TableColumnConfig {
    title: string;
    dataIndex: string;
    fhirPath: string;
}

export interface MagicSearchResponse {
    resourceType: string;
    searchParams: Record<string, any>;
    tableColumns: TableColumnConfig[];
}

export async function performMagicSearch(prompt: string) {
    const appToken = getToken();

    return await service<MagicSearchResponse>({
        baseURL: config.aiAssistantServiceUrl,
        url: `/magic-search`,
        method: 'POST',
        data: { prompt },
        headers: {
            Authorization: `Bearer ${appToken}`,
        },
    });
}
