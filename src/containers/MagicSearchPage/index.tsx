import { Resource } from 'fhir/r4b';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { formatError, RenderRemoteData, useService } from '@beda.software/fhir-react';
import { mapSuccess, success } from '@beda.software/remote-data';

import { MagicSearchResponse, performMagicSearch } from 'src/services';
import { ResourceListPageContent } from 'src/uberComponents/ResourceListPageContent';

import { MagicSearchBar } from './MagicSearchBar';
import { buildDynamicColumns, normalizeMagicSearchParams } from './utils';

interface MagicSearchUIResponse {
    result: MagicSearchResponse | null;
}

export function MagicSearchPage() {
    const [searchQuery, setSearchQuery] = useState('');

    const navigate = useNavigate();
    const location = useLocation();

    const urlParams = new URLSearchParams(location.search);
    const urlPrompt = urlParams.get('prompt') ?? '';

    const [response] = useService<MagicSearchUIResponse>(async () => {
        setSearchQuery(urlPrompt);

        if (!urlPrompt) {
            return Promise.resolve(success({ result: null }));
        }

        return mapSuccess(await performMagicSearch(urlPrompt), (data) => ({
            result: data,
        }));
    }, [urlPrompt]);

    const performSearch = (prompt: string) => {
        const params = new URLSearchParams();
        params.set('prompt', prompt);
        navigate({ pathname: location.pathname, search: params.toString() }, { replace: false });

        setSearchQuery(prompt);
    };

    return (
        <div>
            <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
                <MagicSearchBar
                    query={searchQuery}
                    onQueryChange={setSearchQuery}
                    onSubmit={performSearch}
                    status={response}
                />
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

                    return (
                        <ResourceListPageContent
                            resourceType={result.resourceType}
                            searchParams={{
                                _sort: '-_lastUpdated,_id',
                                _count: 10,
                                ...normalizeMagicSearchParams(result.searchParams),
                            }}
                            getTableColumns={() => buildDynamicColumns<Resource>(result.tableColumns)}
                        />
                    );
                }}
            </RenderRemoteData>
        </div>
    );
}
