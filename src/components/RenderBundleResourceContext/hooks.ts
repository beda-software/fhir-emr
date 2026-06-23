import { Bundle, Resource } from 'fhir/r4b';
import { useParams } from 'react-router-dom';

import { useService, WithId } from '@beda.software/fhir-react';

import { RenderBundleResourceContextProps } from 'src/components/RenderBundleResourceContext';
import { getFHIRResources } from 'src/services/fhir';
import { compileAsFirst } from 'src/utils';

export function useRenderBundleResourceContext<R extends Resource>(props: RenderBundleResourceContextProps<R>) {
    const { resourceType, getSearchParams } = props;

    const params = useParams();

    const [response, manager] = useService(() => getFHIRResources(resourceType, getSearchParams(params)));

    const defaultExtractPrimaryResource = compileAsFirst<Bundle<WithId<R>>, WithId<R>>(
        'Bundle.entry.resource.where(resourceType=%resourceType).first()',
    );

    return { response, manager, defaultExtractPrimaryResource };
}
