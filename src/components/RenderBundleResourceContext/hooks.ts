import { Bundle, Resource } from 'fhir/r4b';
import { useParams } from 'react-router-dom';

import { useService, WithId } from '@beda.software/fhir-react';

import { getFHIRResources } from 'src/services';
import { DetailPageProps } from 'src/uberComponents/ResourceDetailPage/types';
import { RecordType } from 'src/uberComponents/ResourceListPage/types';
import { compileAsFirst } from 'src/utils';

interface RenderBundleResourceContextProps<R extends Resource> extends DetailPageProps<R> {
    children: (context: RecordType<WithId<R>>) => JSX.Element;
}

export function useRenderBundleResourceContext<R extends Resource>(props: RenderBundleResourceContextProps<R>) {
    const { resourceType, getSearchParams } = props;

    const params = useParams();

    const [response] = useService(() => getFHIRResources(resourceType, getSearchParams(params)));

    const defaultExtractPrimaryResource = compileAsFirst<Bundle<WithId<R>>, WithId<R>>(
        'Bundle.entry.resource.where(resourceType=%resourceType).first()',
    );

    return { response, defaultExtractPrimaryResource };
}
