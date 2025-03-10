import { Bundle, Composition, DomainResource, Patient } from 'fhir/r4b';

import config from '@beda.software/emr-config';
import { extractBundleResources, formatFHIRDateTime } from '@beda.software/fhir-react';
import { isSuccess, mapSuccess } from '@beda.software/remote-data';

import { getFHIRResources, patchFHIRResource, saveFHIRResource, service } from 'src/services/fhir';
import { LOINC_CODESYSTEM } from 'src/utils';

const PATIENT_SUMMARY_DOC_LOINC_CODE = '60591-5';

export async function createNewPatientSummary(patient: Patient) {
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

export async function getLatestPatientSummary(patient: Patient) {
    return mapSuccess(
        await getFHIRResources<Composition>('Composition', {
            subject: patient.id,
            type: `${LOINC_CODESYSTEM}|${PATIENT_SUMMARY_DOC_LOINC_CODE}`,
            _sort: '-createdAt',
            _count: 1,
        }),
        (bundle) => {
            const resources = extractBundleResources(bundle).Composition;
            return resources.length ? resources[0] : undefined;
        },
    );
}

export async function generateNarrativeForResource(resource: DomainResource) {
    return await service<{ resource: DomainResource; summary: string }>({
        method: 'POST',
        baseURL: config.aiAssistantServiceUrl ?? undefined,
        url: '/summarize_resource',
        data: resource,
        headers: { 'Content-Type': 'application/json' },
    });
}

export async function addTextToResource(resource: DomainResource) {
    const resourceSummaryRD = await generateNarrativeForResource(resource);
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
    return await saveFHIRResource<Composition>({
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
                            code: PATIENT_SUMMARY_DOC_LOINC_CODE,
                            system: LOINC_CODESYSTEM,
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
                    code: PATIENT_SUMMARY_DOC_LOINC_CODE,
                    system: LOINC_CODESYSTEM,
                    display: 'Patient summary Document',
                },
            ],
        },
        text: {
            status: 'generated',
            div: 'AI-generated Summary',
        },
    });
}
