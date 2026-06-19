import { Bundle, ParametersParameter, Resource } from 'fhir/r4b';

import { SearchParams, WithId } from '@beda.software/fhir-react';

export interface BundleResourceContextProps<R extends Resource> {
    resourceType: R['resourceType'];
    getSearchParams: (params: Readonly<Record<string, string | string[] | undefined>>) => SearchParams;
    extractPrimaryResource?: (bundle: Bundle<R>) => WithId<R>;
    toClinicalContext?: (bundle: Bundle) => ParametersParameter[];
}
