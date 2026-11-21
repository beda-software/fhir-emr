import { Patient } from 'fhir/r4b';

import { PatientImagingProps } from './types';

export function buildListSearchParams(
    patient: Patient,
    { encounter, modalities }: Pick<PatientImagingProps, 'encounter' | 'modalities'>,
): Record<string, string | number> {
    return {
        subject: `Patient/${patient.id}`,
        ...(encounter ? { encounter: `Encounter/${encounter.id}` } : {}),
        ...(modalities?.length ? { 'exam-modality': modalities.join(',') } : {}),
        status: 'available',
        _sort: '-started',
        _count: 10,
    };
}
