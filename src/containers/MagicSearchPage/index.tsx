import { SearchOutlined } from '@ant-design/icons';
import { t, Trans } from '@lingui/macro';
import { Button, Input, Radio } from 'antd';
import type { ColumnsType } from 'antd/es/table/interface';
import { Resource } from 'fhir/r4b';
import fhirpath_r4_model from 'fhirpath/fhir-context/r4';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { formatError, RenderRemoteData, useService } from '@beda.software/fhir-react';
import { isLoading, mapSuccess, success } from '@beda.software/remote-data';

import { MagicSearchResponse, performMagicSearch, TableColumnConfig } from 'src/services';
import { RecordType } from 'src/uberComponents/ResourceListPage/types.ts';
import { ResourceListPageContent } from 'src/uberComponents/ResourceListPageContent';
import { compileAsFirst, formatHumanDate, renderHumanName } from 'src/utils';

const compileGeneric = <R extends Resource, T>(fhirPath: string): ((resource: R) => T | undefined) => {
    return compileAsFirst(fhirPath, fhirpath_r4_model) as (resource: R) => T | undefined;
};

function buildDynamicColumns<R extends Resource>(columnConfigs: TableColumnConfig[]): ColumnsType<RecordType<R>> {
    return columnConfigs.map((column) => {
        const valueExtractor = compileGeneric<R, any>(column.fhirPath);

        return {
            title: column.title,
            dataIndex: column.dataIndex,
            key: column.dataIndex,
            render: (_text: any, record: RecordType<R>) => {
                const value = valueExtractor(record.resource);

                if (value && typeof value === 'object' && ('family' in value || 'given' in value)) {
                    return renderHumanName(value);
                }

                if (value && typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
                    return formatHumanDate(value);
                }

                if (
                    value &&
                    typeof value === 'object' &&
                    'reference' in value &&
                    value.reference.includes('Patient/')
                ) {
                    const id = value.reference.split('Patient/')[1];
                    if (value.display) {
                        return <Link to={`/patients/${id}`}>{value.display}</Link>;
                    } else {
                        return <Link to={`/patients/${id}`}>{id}</Link>;
                    }
                }

                return value ? String(value) : null;
            },
        };
    });
}

interface MagicSearchUIResponse {
    result: MagicSearchResponse | null;
}

export function MagicSearchPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [mcpServer, setMcpServer] = useState<'tx-tools' | 'semmatch'>('tx-tools');

    const navigate = useNavigate();
    const location = useLocation();

    const urlParams = new URLSearchParams(location.search);
    const urlPrompt = urlParams.get('prompt') ?? '';
    const urlMcpServer = urlParams.get('mcpServer') === 'semmatch' ? 'semmatch' : 'tx-tools';

    const [response] = useService<MagicSearchUIResponse>(async () => {
        setSearchQuery(urlPrompt);
        setMcpServer(urlMcpServer);

        if (!urlPrompt) {
            return Promise.resolve(success({ result: null }));
        }

        return mapSuccess(await performMagicSearch(urlPrompt, urlMcpServer), (data) => ({
            result: data,
        }));
    }, [urlPrompt, urlMcpServer]);

    const isDataLoading = isLoading(response);

    const performSearch = (prompt: string, server: 'tx-tools' | 'semmatch') => {
        const params = new URLSearchParams();
        params.set('prompt', prompt);
        params.set('mcpServer', server);
        navigate({ pathname: location.pathname, search: params.toString() }, { replace: false });

        setSearchQuery(prompt);
        setMcpServer(server);
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            return;
        }
        performSearch(searchQuery.trim(), mcpServer);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div>
            <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
                <div style={{ display: 'flex', gap: 15, alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                        <Input
                            placeholder={t`Enter your search query`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={handleKeyPress}
                            size="large"
                            disabled={isDataLoading}
                        />
                    </div>
                    <div>
                        <Radio.Group
                            value={mcpServer}
                            onChange={(e) => setMcpServer(e.target.value)}
                            optionType="button"
                            buttonStyle="solid"
                            size="large"
                            disabled={isDataLoading}
                        >
                            <Radio.Button value="tx-tools">tx-tools</Radio.Button>
                            <Radio.Button value="semmatch">semmatch</Radio.Button>
                        </Radio.Group>
                    </div>
                    <div>
                        <Button
                            type="primary"
                            icon={<SearchOutlined />}
                            onClick={handleSearch}
                            size="large"
                            disabled={!searchQuery.trim() || isDataLoading}
                            loading={isDataLoading}
                        >
                            {isDataLoading ? <Trans>Searching...</Trans> : <Trans>Search</Trans>}
                        </Button>
                    </div>
                </div>
            </div>

            <RenderRemoteData
                remoteData={response}
                renderLoading={() => null as any}
                renderFailure={(error) => (
                    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', color: 'red' }}>
                        {formatError(error)}
                    </div>
                )}
            >
                {({ result }) => {
                    if (!result) {
                        return <div></div>;
                    }

                    const getTableColumns = (): ColumnsType<RecordType<Resource>> =>
                        buildDynamicColumns<Resource>(result.tableColumns);

                    return (
                        <ResourceListPageContent
                            resourceType={result.resourceType as any}
                            searchParams={{
                                _sort: '-_lastUpdated,_id',
                                _count: 10,
                                ...result.searchParams,
                            }}
                            getTableColumns={getTableColumns}
                        />
                    );
                }}
            </RenderRemoteData>
        </div>
    );
}
