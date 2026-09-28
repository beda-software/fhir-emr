import { aiService } from './ai';
import { getToken } from './auth';

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

export async function performMagicSearch(prompt: string, mcpServer: 'tx-tools' | 'semmatch' = 'tx-tools') {
    const appToken = getToken();

    return await aiService<MagicSearchResponse>({
        url: `/magic-search`,
        method: 'POST',
        data: { prompt, mcpServer: mcpServer },
        headers: {
            Authorization: `Bearer ${appToken}`,
        },
    });
}
