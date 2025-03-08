import { DomainResource, Patient } from 'fhir/r4b';

import config from '@beda.software/emr-config';
import { formatFHIRDateTime } from '@beda.software/fhir-react';
import { isSuccess } from '@beda.software/remote-data';

import { patchFHIRResource, saveFHIRResource, service } from 'src/services/fhir.ts';

export async function addTextToResource(resource: DomainResource) {
    const resourceSummaryRD = await service<{ resource: DomainResource; summary: string }>({
        method: 'POST',
        baseURL: config.aiAssistantServiceUrl ?? undefined,
        url: '/summarize_resource',
        data: resource,
        headers: { 'Content-Type': 'application/json' },
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

export async function generatePatientSummary(inputData: string) {
    return await service<{ summary: string }>({
        method: 'POST',
        baseURL: config.aiAssistantServiceUrl ?? undefined,
        url: '/summarize',
        data: {
            purpose: 'Make a brief patient overview',
            data: inputData,
            mode: 'overview',
        },
        headers: { 'Content-Type': 'application/json' },
    });
}

export async function saveSummaryComposition(patient: Patient, summaryText: string) {
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
