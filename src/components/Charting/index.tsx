import { Bundle, Resource } from 'fhir/r4b';
import { useParams } from 'react-router-dom';

import { RenderRemoteData, useService, WithId } from '@beda.software/fhir-react';

import { getFHIRResources } from 'src/services';
import { RecordType } from 'src/uberComponents/ResourceListPage/types';
import { compileAsFirst } from 'src/utils';

import { PageChartingContainer } from './PageChartingContainer';
import { ChartingProps } from './types';

export function Charting<R extends Resource>({
    resourceType,
    getSearchParams,
    getTitle,
    extractPrimaryResource,
    chartingContent,
    titleRightElement,
    maxWidth,
    children,
    headerContent,
    chartingHeader,
}: ChartingProps<R>) {
    const params = useParams();

    const [response] = useService(() => getFHIRResources(resourceType, getSearchParams(params)));

    const defaultExtractPrimaryResource = compileAsFirst<Bundle<WithId<R>>, R>(
        'Bundle.entry.resource.where(resourceType=%resourceType).first()',
    );

    return (
        <RenderRemoteData remoteData={response}>
            {(bundle) => {
                let resource: R | undefined = undefined;

                if (extractPrimaryResource) {
                    resource = extractPrimaryResource(bundle);
                } else {
                    resource = defaultExtractPrimaryResource(bundle, { resourceType });
                }

                if (typeof resource === 'undefined') {
                    return <p>NASTY ERROR</p>;
                }

                const context: RecordType<R> = { resource, bundle: bundle as Bundle };

                return (
                    <PageChartingContainer
                        title={getTitle(context)}
                        layoutVariant="with-tabs"
                        headerContent={headerContent}
                        titleRightElement={titleRightElement}
                        maxWidth={maxWidth}
                        chartingHeader={chartingHeader}
                        chartingContent={chartingContent}
                    >
                        {children}
                    </PageChartingContainer>
                );
            }}
        </RenderRemoteData>
    );
}
