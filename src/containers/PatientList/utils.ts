import { formatFHIRDate } from 'aidbox-react/lib/utils/date';

import { SearchParams } from 'fhir-react/lib/services/search';

export function getPatientSearchParamsForPractitioner(practitionerId: string): SearchParams {
    return {
        '_has:Consent:patient:status': 'active',
        '_has:Consent:patient:category': 'data-sharing',
        '_has:Consent:patient:period': formatFHIRDate(new Date()),
        '_has:Consent:patient:actor': practitionerId,
    };
}
