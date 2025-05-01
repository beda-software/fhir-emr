import { Resource } from 'fhir/r4b';

import { WithId } from '@beda.software/fhir-react';

import { PageChartingContainer } from './PageChartingContainer';
import { ChartingProps } from './types';
import { RenderBundleResourceContext } from '../RenderBundleResourceContext';

export function Charting<R extends WithId<Resource>>(props: ChartingProps<R>) {
    const {
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
    } = props;

    return (
        <RenderBundleResourceContext<R>
            resourceType={resourceType}
            getSearchParams={getSearchParams}
            extractPrimaryResource={extractPrimaryResource}
            getTitle={getTitle}
            tabs={[]}
        >
            {(context) => (
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
            )}
        </RenderBundleResourceContext>
    );
}
