import { Patient } from 'fhir/r4b';
import { useState } from 'react';

import { useService } from '@beda.software/fhir-react';
import { isSuccess } from '@beda.software/remote-data';

import { createNewPatientSummary, getLatestPatientSummary } from 'src/services/ai-summary.ts';

export function useSummaryCard(patient: Patient) {
    const [summaryCompositionRD, manager] = useService(async () => await getLatestPatientSummary(patient));

    const [summaryIsUpdating, setSummaryIsUpdating] = useState<boolean>(false);

    async function generateSummary() {
        setSummaryIsUpdating(true);
        const response = await createNewPatientSummary(patient);
        if (isSuccess(response)) {
            setSummaryIsUpdating(false);
            manager.softReloadAsync();
        }
    }

    return {
        summaryCompositionRD,
        generateSummary,
        summaryIsUpdating,
    };
}
