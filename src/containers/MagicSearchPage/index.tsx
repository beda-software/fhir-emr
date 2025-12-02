import { SearchOutlined } from '@ant-design/icons';
import { t, Trans } from '@lingui/macro';
import { Input, Button, Space } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { Resource } from 'fhir/r4b';
import fhirpath_r4_model from 'fhirpath/fhir-context/r4';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { formatError, RenderRemoteData } from '@beda.software/fhir-react';
import { isLoading, loading, notAsked, RemoteData } from '@beda.software/remote-data';

import { performMagicSearch, MagicSearchResponse, TableColumnConfig } from 'src/services';
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

export function MagicSearchPage() {
    const [response, setResponse] = useState<RemoteData<MagicSearchResponse>>(notAsked);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = async () => {
        setResponse(loading);

        const data = await performMagicSearch(searchQuery);
        setResponse(data);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const isDataLoading = isLoading(response);

    return (
        <div>
            <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
                <Space.Compact style={{ width: '100%' }}>
                    <Input
                        placeholder={t`Enter your search query`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                        size="large"
                        disabled={isDataLoading}
                    />
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
                </Space.Compact>
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
                {(data) => {
                    const getTableColumns = (): ColumnsType<RecordType<Resource>> =>
                        buildDynamicColumns<Resource>(data.tableColumns);

                    return (
                        <ResourceListPageContent
                            resourceType={data.resourceType as any}
                            searchParams={{
                                _sort: '-_lastUpdated,_id',
                                _count: 10,
                                ...data.searchParams,
                            }}
                            getTableColumns={getTableColumns}
                        />
                    );
                }}
            </RenderRemoteData>
        </div>
    );
}
