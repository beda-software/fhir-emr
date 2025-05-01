import { Bundle, Resource } from 'fhir/r4b';

import { RenderRemoteData, WithId } from '@beda.software/fhir-react';

import { DetailPageProps } from 'src/uberComponents/ResourceDetailPage/types';
import { RecordType } from 'src/uberComponents/ResourceListPage/types';

import { useRenderBundleResourceContext } from './hooks';

interface RenderBundleResourceContextProps<R extends Resource> extends DetailPageProps<R> {
    children: (context: RecordType<WithId<R>>) => JSX.Element;
}

export function RenderBundleResourceContext<R extends Resource>(props: RenderBundleResourceContextProps<R>) {
    const { resourceType, extractPrimaryResource, children } = props;

    const { response, defaultExtractPrimaryResource } = useRenderBundleResourceContext<R>(props);

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
