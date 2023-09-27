import { formatFHIRDate } from 'aidbox-react/lib/utils/date';

import { SearchParams } from 'fhir-react/lib/services/search';

export function getPatientSearchParamsForPractitioner(practitionerId: string): SearchParams {
    return {
        status: 'active',
        category: 'data-sharing',
        period: formatFHIRDate(new Date()),
        actor: practitionerId,
        _include: ['Consent:patient:Patient'],
    };
}
