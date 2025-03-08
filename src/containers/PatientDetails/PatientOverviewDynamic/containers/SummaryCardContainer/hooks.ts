import { Bundle, Composition, DomainResource, Patient } from 'fhir/r4b';
import { useState } from 'react';

import { extractBundleResources, useService } from '@beda.software/fhir-react';
import { isSuccess, mapSuccess } from '@beda.software/remote-data';

import { addTextToResource, generatePatientSummary, saveSummaryComposition } from 'src/services/ai-summary.ts';
import { getFHIRResources, service } from 'src/services/fhir';

export function useSummaryCard(patient: Patient) {
    const [summaryCompositionRD, manager] = useService(async () => {
        return mapSuccess(
            await getFHIRResources<Composition>('Composition', {
                subject: patient.id,
                type: 'http://loinc.org|60591-5',
                _sort: '-createdAt',
                _count: 1,
            }),
            (bundle) => {
                const resources = extractBundleResources(bundle).Composition;
                return resources.length ? resources[0] : undefined;
            },
        );
    });

    const [summaryIsUpdating, setSummaryIsUpdating] = useState<boolean>(false);

    async function generateSummary() {
        setSummaryIsUpdating(true);
        const response = await createNewSummary(patient);
        if (isSuccess(response)) {
            setSummaryIsUpdating(false);
            manager.softReloadAsync();
        }
    }

    async function createNewSummary(patient: Patient) {
        const patientEverythingRD = await service<Bundle<DomainResource>>({
            method: 'GET',
            url: `Patient/${patient.id}/$everything`,
        });
        const resourceSummaries: string[] = [];
        if (isSuccess(patientEverythingRD)) {
            patientEverythingRD.data.entry!.map((entry) => {
                if (entry.resource?.text) {
                    resourceSummaries.push(entry.resource?.text.div);
                } else {
                    console.log('No narrative', entry.resource);
                    resourceSummaries.push(JSON.stringify(entry.resource));
                    addTextToResource(entry.resource!);
                }
            });
            const patientSummaryTextRD = await generatePatientSummary(resourceSummaries.join(';'));
            if (isSuccess(patientSummaryTextRD)) {
                return await saveSummaryComposition(patient, patientSummaryTextRD.data.summary);
            }
            return patientSummaryTextRD;
        }
        return patientEverythingRD;
    }

    return {
        summaryCompositionRD,
        generateSummary,
        summaryIsUpdating,
    };
}


