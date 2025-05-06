import { Resource, Bundle } from 'fhir/r4b';

import { WithId, useService, extractBundleResources } from '@beda.software/fhir-react';
import { mapSuccess } from '@beda.software/remote-data';

import { getFHIRResources } from 'src/services/fhir';

import { ResourceChartingPageProps } from './types';
import { ResourceContext } from '../types';

export function useResourceChartingPage<R extends WithId<Resource>>(props: ResourceChartingPageProps<R>) {
    const [mainResourceResponse, manager] = useService(async () =>
        mapSuccess(await getFHIRResources<R>(props.resourceType, props?.searchParams ?? {}), (bundle) => {
            const extractedResources = extractBundleResources<R>(bundle);
            const targetResources = extractedResources[props.resourceType];
            const targetResource = targetResources?.[0];

            const context: ResourceContext<R> = { resource: targetResource as WithId<R>, bundle: bundle as Bundle };

            return {
                resource: targetResource,
                title: props.title(context),
                attributes: props.attributesToDisplay?.map((item) => {
                    return {
                        icon: item.icon,
                        data: item.getText(context),
                    };
                }),
            };
        }),
    );

    return {
        response: mainResourceResponse,
        reload: manager.reload
    };
}
