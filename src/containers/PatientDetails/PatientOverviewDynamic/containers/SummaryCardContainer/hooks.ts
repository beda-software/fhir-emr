import { Bundle, Composition, DomainResource, Patient } from 'fhir/r4b';
import { useState } from 'react';

import config from '@beda.software/emr-config';
import { extractBundleResources, formatFHIRDateTime, useService } from '@beda.software/fhir-react';
import { isSuccess, mapSuccess } from '@beda.software/remote-data';

import { getToken } from 'src/services';
import { getFHIRResources, patchFHIRResource, saveFHIRResource, service } from 'src/services/fhir';

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

async function addTextToResource(resource: DomainResource) {
    const resourceSummaryRD = await service<{ resource: DomainResource; summary: string }>({
        method: 'POST',
        baseURL: config.aiAssistantServiceUrl ?? undefined,
        url: '/summarize_resource',
        data: resource,
        headers: { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'multipart' },
    });
    if (isSuccess(resourceSummaryRD)) {
        const resourceSummaryText = resourceSummaryRD.data.summary;
        await patchFHIRResource<DomainResource>({
            id: resource!.id!,
            resourceType: resource!.resourceType,
            text: {
                status: 'generated',
                div: resourceSummaryText,
            },
        });
    }
    return resourceSummaryRD;
}

async function generatePatientSummary(inputData: string) {
    return await service<{ summary: string }>({
        method: 'POST',
        baseURL: config.aiAssistantServiceUrl ?? undefined,
        url: '/summarize',
        data: {
            purpose: 'Make a brief patient overview',
            data: inputData,
            mode: 'overview',
        },
        headers: { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'multipart' },
    });
}

async function saveSummaryComposition(patient: Patient, summaryText: string) {
    return await saveFHIRResource({
        resourceType: 'Composition',
        author: [
            {
                display: 'AI agent',
                reference: 'Device/ai-agent',
            },
        ],
        date: formatFHIRDateTime(new Date()),
        section: [
            {
                code: {
                    coding: [
                        {
                            code: '60591-5',
                            system: 'http://loinc.org',
                            display: 'Patient summary Document',
                        },
                    ],
                },
                text: {
                    div: JSON.parse(summaryText).text,
                    status: 'generated',
                },
                title: 'AI Summary',
            },
        ],
        status: 'final',
        subject: {
            reference: `Patient/${patient.id}`,
        },
        title: 'AI-generated Summary',
        type: {
            coding: [
                {
                    code: '60591-5',
                    system: 'http://loinc.org',
                    display: 'Patient summary Document',
                },
            ],
        },
    });
}
