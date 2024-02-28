import { Patient } from 'fhir/r4b';

import { SearchParams } from '@beda.software/fhir-react';

export function useStandardCard(patient: Patient, searchParams: SearchParams) {
    return { patient, searchParams };
}
