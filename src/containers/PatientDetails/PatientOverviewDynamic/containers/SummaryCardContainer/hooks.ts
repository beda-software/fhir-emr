import { Patient } from 'fhir/r4b';
import { useState } from 'react';

import { useService } from '@beda.software/fhir-react';
import { isSuccess, loading, notAsked, RemoteData, isFailure } from '@beda.software/remote-data';

import { createNewPatientSummary, getLatestPatientSummary } from 'src/services/ai-summary.ts';

export function useSummaryCard(patient: Patient) {
    const [summaryCompositionRD, manager] = useService(async () => await getLatestPatientSummary(patient));

    const [summaryUpdateState, setSummaryUpdateState] = useState<RemoteData>(notAsked);

    async function generateSummary() {
        setSummaryUpdateState(loading);
        const response = await createNewPatientSummary(patient);
        if (isSuccess(response)) {
            setSummaryUpdateState(response);
            await manager.softReloadAsync();
        }
        if (isFailure(response)) {
            setSummaryUpdateState(response);
        }
        return response;
    }

    return {
        summaryCompositionRD,
        generateSummary,
        summaryUpdateState,
    };
}
