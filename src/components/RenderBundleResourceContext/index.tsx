import { Bundle, Resource } from 'fhir/r4b';
import { useParams } from 'react-router-dom';

import { RenderRemoteData, useService, WithId } from '@beda.software/fhir-react';

import { getFHIRResources } from 'src/services';
import { DetailPageProps } from 'src/uberComponents/ResourceDetailPage/types';
import { RecordType } from 'src/uberComponents/ResourceListPage/types';
import { compileAsFirst } from 'src/utils';

interface RenderBundleResourceContextProps<R extends Resource> extends DetailPageProps<R> {
    children: (context: RecordType<WithId<R>>) => JSX.Element;
}

export function RenderBundleResourceContext<R extends Resource>(props: RenderBundleResourceContextProps<R>) {
    const { resourceType, getSearchParams, extractPrimaryResource, children } = props;

    const params = useParams();

    const [response] = useService(() => getFHIRResources(resourceType, getSearchParams(params)));

    const defaultExtractPrimaryResource = compileAsFirst<Bundle<WithId<R>>, WithId<R>>(
        'Bundle.entry.resource.where(resourceType=%resourceType).first()',
    );

    return (
        <RenderRemoteData remoteData={response}>
            {(bundle) => {
                let resource: WithId<R> | undefined = undefined;

                if (extractPrimaryResource) {
                    resource = extractPrimaryResource(bundle);
                } else {
                    resource = defaultExtractPrimaryResource(bundle, { resourceType });
                }

                if (typeof resource === 'undefined') {
                    return <p>NASTY ERROR</p>;
                }

                const context: RecordType<WithId<R>> = { resource, bundle: bundle as Bundle };

                return children(context);
            }}
        </RenderRemoteData>
    );
}
