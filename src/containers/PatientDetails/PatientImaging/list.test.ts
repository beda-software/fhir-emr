import { Encounter, Patient } from 'fhir/r4b';
import { describe, expect, it } from 'vitest';

import { buildListSearchParams } from './list';

describe('buildListSearchParams', () => {
    const patient: Patient = { resourceType: 'Patient', id: 'p1' };

    it("lists the Patient's available studies of the page's modalities, newest first", () => {
        expect(buildListSearchParams(patient, { modalities: ['US', 'CT'] })).toEqual({
            subject: 'Patient/p1',
            status: 'available',
            _sort: '-started',
            _count: 10,
            'exam-modality': 'US,CT',
        });
    });

    it('scopes the List to the Encounter when the page has one', () => {
        const encounter: Encounter = {
            resourceType: 'Encounter',
            id: 'e1',
            status: 'finished',
            class: { code: 'AMB' },
        };
        expect(buildListSearchParams(patient, { encounter })).toMatchObject({
            subject: 'Patient/p1',
            encounter: 'Encounter/e1',
        });
    });

    it('lists every modality when the page names none', () => {
        expect(buildListSearchParams(patient, {})).not.toHaveProperty('exam-modality');
        expect(buildListSearchParams(patient, { modalities: [] })).not.toHaveProperty('exam-modality');
    });
});
