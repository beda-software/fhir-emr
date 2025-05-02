import { ResourceChartingPageProps } from './types';
import { Resource } from 'fhir/r4b';

import { WithId } from '@beda.software/fhir-react';
import { getFHIRResource } from 'src/services/fhir';
import { useService } from '@beda.software/fhir-react';
import { mapSuccess } from '@beda.software/remote-data';

export function useResourceChartingPage<R extends WithId<Resource>>(props: ResourceChartingPageProps<R>) {
    console.log('props', props);
    const [mainResourceResponse] = useService(async () =>

        mapSuccess(
            await getFHIRResource<R>({
                reference: `${props.resourceType}/${props.searchParams?._id}`,
            }),
            (r) => ({
                resource: r,
                title: props.title(r),
                attributes: props.attributesToDisplay?.map((item) => {
                    return {
                        icon: item.icon,
                        data: item.dataGetterFn(r)
                    }
                })
            })
        ),
    );

    return {
        response: mainResourceResponse
    }
}
