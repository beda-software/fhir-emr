import { SearchOutlined } from "@ant-design/icons";
import {t, Trans} from "@lingui/macro";
import { Input, Button, Space } from "antd";
import {ColumnsType} from "antd/lib/table";
import {Resource} from "fhir/r4b";
import {useState} from "react";

import { RenderRemoteData } from '@beda.software/fhir-react';
import {isSuccess, loading, notAsked, RemoteData} from "@beda.software/remote-data";

import {performMagicSearch, MagicSearchResponse, TableColumnConfig} from "src/services";
import {RecordType} from "src/uberComponents/ResourceListPage/types.ts";
import {ResourceListPageContent} from "src/uberComponents/ResourceListPageContent";
import {compileAsFirst, formatHumanDate, renderHumanName} from "src/utils";

const compileGeneric = <R extends Resource, T>(fhirPath: string): ((resource: R) => T | undefined) => {
    return compileAsFirst(fhirPath) as (resource: R) => T | undefined;
};

function buildDynamicColumns<R extends Resource>(
    columnConfigs: TableColumnConfig[]
): ColumnsType<RecordType<R>> {
    return columnConfigs.map(column => {
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

                if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
                    return formatHumanDate(value);
                }

                return value ? String(value) : null;
            }
        };
    });
}

export function MagicSearchPage() {
    const [response, setResponse] = useState<RemoteData<MagicSearchResponse>>(notAsked);
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = async () => {
        setResponse(loading);

        const data = await performMagicSearch(searchQuery);
        if (isSuccess(data)) {
            setResponse(data)
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div>
            <RenderRemoteData
                remoteData={response}
                renderNotAsked={() => (
                    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
                        <Space.Compact style={{ width: '100%' }}>
                            <Input
                                placeholder={t`Enter your search query`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={handleKeyPress}
                                size="large"
                            />
                            <Button
                                type="primary"
                                icon={<SearchOutlined />}
                                onClick={handleSearch}
                                size="large"
                                disabled={!searchQuery.trim()}
                            >
                                <Trans>Search</Trans>
                            </Button>
                        </Space.Compact>
                    </div>
                )}
                renderLoading={() => (
                    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
                        <Space.Compact style={{ width: '100%' }}>
                            <Input
                                placeholder={t`Enter your search query`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={handleKeyPress}
                                size="large"
                                disabled
                            />
                            <Button
                                type="primary"
                                icon={<SearchOutlined />}
                                loading
                                size="large"
                            >
                                <Trans>Searching...</Trans>
                            </Button>
                        </Space.Compact>
                    </div>
                )}
                renderFailure={(error) => (
                    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
                        <Space.Compact style={{ width: '100%' }}>
                            <Input
                                placeholder={t`Enter your search query`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={handleKeyPress}
                                size="large"
                            />
                            <Button
                                type="primary"
                                icon={<SearchOutlined />}
                                onClick={handleSearch}
                                size="large"
                                disabled={!searchQuery.trim()}
                            >
                                <Trans>Search</Trans>
                            </Button>
                        </Space.Compact>
                        <div style={{ marginTop: '16px', color: 'red' }}>
                            <Trans>Error: {error.message}</Trans>
                        </div>
                    </div>
                )}
            >
                {(data) => {
                    const getTableColumns = (): ColumnsType<RecordType<Resource>> => buildDynamicColumns<Resource>(data.tableColumns);
                    
                    return (
                        <div>
                            <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto 20px' }}>
                                <Space.Compact style={{ width: '100%' }}>
                                    <Input
                                        placeholder={t`Enter your search query`}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        size="large"
                                    />
                                    <Button
                                        type="primary"
                                        icon={<SearchOutlined />}
                                        onClick={handleSearch}
                                        size="large"
                                        disabled={!searchQuery.trim()}
                                    >
                                        <Trans>Search</Trans>
                                    </Button>
                                </Space.Compact>
                            </div>
                            <ResourceListPageContent
                                resourceType={data.resourceType as any}
                                searchParams={{
                                    _sort: '-_lastUpdated,_id',
                                    _count: 10,
                                    ...data.searchParams,
                                }}
                                getTableColumns={getTableColumns}
                            />
                    </div>
                );
                }}
            </RenderRemoteData>
        </div>
    );
}
