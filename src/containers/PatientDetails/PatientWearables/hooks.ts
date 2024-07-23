import { Consent, Organization, Patient, Practitioner } from 'fhir/r4b';

import config from '@beda.software/emr-config';
import { WithId, extractBundleResources, formatError, useService } from '@beda.software/fhir-react';
import { isFailure, isSuccess, mapSuccess, serviceFetch, success } from '@beda.software/remote-data';

import { getToken } from 'src/services/auth';
import { getFHIRResources } from 'src/services/fhir';
import { Role, matchCurrentUserRole } from 'src/utils/role';

export interface WearablesDataRecord {
    sid: string;
    ts: string;
    start: string;
    finish: string;
    code?: string;
    duration?: number;
    energy?: number;
    provider?: string;
}

type WearablesData = { records: WearablesDataRecord[] };

export function usePatientWearablesData(patient: WithId<Patient>) {
    return useService(async () => {
        const consentResponse = await matchCurrentUserRole({
            [Role.Admin]: (organization: WithId<Organization>) =>
                fetchConsentStatus(organization, patient, 'emr-datasequence-records'),
            [Role.Practitioner]: (practitioner: WithId<Practitioner>) =>
                fetchConsentStatus(practitioner, patient, 'emr-datasequence-records'),
            [Role.Receptionist]: (practitioner: WithId<Practitioner>) =>
                fetchConsentStatus(practitioner, patient, 'emr-datasequence-records'),
            [Role.Patient]: () => Promise.resolve(success({ hasConsent: true })),
        });

        if (isFailure(consentResponse)) {
            return consentResponse;
        }

        const patientRecordsResponse = await fetchPatientRecords(patient);
        const patientMetriportRecordsResponse = await fetchPatientMetriportRecords(patient);

        if (isFailure(patientRecordsResponse) && isFailure(patientMetriportRecordsResponse)) {
            return patientRecordsResponse;
        }
        let aggregatedRecords: WearablesDataRecord[] = [];
        if (isSuccess(patientRecordsResponse)) {
            aggregatedRecords = aggregatedRecords.concat(patientRecordsResponse.data.records);
        }
        if (isSuccess(patientMetriportRecordsResponse)) {
            aggregatedRecords = aggregatedRecords.concat(patientMetriportRecordsResponse.data.records);
        }

        return success({
            hasConsent: consentResponse.data.hasConsent,
            aggregatedRecords,
            patientRecordsWarning: isFailure(patientRecordsResponse) ? patientRecordsResponse.error : undefined,
            patientMetriportRecordsWarning: isFailure(patientMetriportRecordsResponse)
                ? formatError(JSON.parse(patientMetriportRecordsResponse.error.message))
                : undefined,
        });
    });
}

async function fetchConsentStatus(
    actor: WithId<Practitioner | Organization>,
    patient: WithId<Patient>,
    consentSubject: string,
) {
    return mapSuccess(
        await getFHIRResources<Consent>('Consent', {
            patient: patient.id,
            actor: actor.id,
            status: 'active',
            action: 'access',
            'data:Endpoint.identifier': `${config.wearablesAccessConsentCodingSystem}|${consentSubject}`,
        }),
        (bundle) => {
            return {
                hasConsent: Boolean(
                    extractBundleResources(bundle).Consent?.find((consent) => consent.provision?.type === 'permit'),
                ),
            };
        },
    );
}

async function fetchPatientRecords(patient: WithId<Patient>) {
    return serviceFetch<WearablesData>(
        matchCurrentUserRole({
            [Role.Patient]: () => `${config.wearablesDataStreamService}/records`,
            [Role.Admin]: () => `${config.wearablesDataStreamService}/${patient.id}/records`,
            [Role.Practitioner]: () => `${config.wearablesDataStreamService}/${patient.id}/records`,
            [Role.Receptionist]: () => `${config.wearablesDataStreamService}/${patient.id}/records`,
        }),
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
            },
        },
    );
}

async function fetchPatientMetriportRecords(patient: WithId<Patient>) {
    return serviceFetch<WearablesData>(
        matchCurrentUserRole({
            [Role.Patient]: () => `${config.wearablesDataStreamService}/metriport/records`,
            [Role.Admin]: () => `${config.wearablesDataStreamService}/metriport/${patient.id}/records`,
            [Role.Practitioner]: () => `${config.wearablesDataStreamService}/metriport/${patient.id}/records`,
            [Role.Receptionist]: () => `${config.wearablesDataStreamService}/metriport/${patient.id}/records`,
        }),
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
            },
        },
    );
}
