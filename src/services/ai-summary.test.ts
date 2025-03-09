import { Patient } from 'fhir/r4b';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { success } from '@beda.software/remote-data';

import { createNewPatientSummary, getLatestPatientSummary } from 'src/services/ai-summary';
import { service } from 'src/services/fhir';
import { loginAdminUser } from 'src/setupTests';

vi.mock('src/services/fhir', async () => {
    const actual = await vi.importActual<typeof import('src/services/fhir')>('src/services/fhir');
    return {
        ...actual,
        patchFHIRResource: vi.fn(),
        service: vi.fn(),
    };
});

const patient: Patient = { resourceType: 'Patient', id: 'patient1' };

describe('AI Summary Module', () => {
    beforeEach(async () => {
        vi.clearAllMocks();
        await loginAdminUser();
    });

    it('Should create a new patient summary and get it after', async () => {
        vi.mocked(service).mockResolvedValueOnce(
            success({
                entry: [
                    { resource: { id: 'res1', text: { div: 'Resource 1 summary' } } },
                    { resource: { id: 'res2', text: { div: 'Resource 2 summary' } } },
                ],
            }),
        );

        vi.mocked(service).mockResolvedValueOnce(
            success({
                summary: JSON.stringify({ text: 'Generated Patient Summary' }),
            }),
        );

        const result = await createNewPatientSummary(patient);

        const latest = await getLatestPatientSummary(patient);

        expect(result).toEqual(latest);
        //@ts-ignore
        expect(latest.data.section[0].text.div).toEqual('Generated Patient Summary');
    });
});
