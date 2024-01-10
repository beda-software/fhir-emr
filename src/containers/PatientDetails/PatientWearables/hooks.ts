import { Consent, Organization, Patient, Practitioner } from 'fhir/r4b';

import { useService } from 'fhir-react/lib/hooks/service';
import { isFailure, isSuccess, success } from 'fhir-react/lib/libs/remoteData';
import { service } from 'fhir-react/lib/services/fetch';
import { WithId, getFHIRResources, extractBundleResources } from 'fhir-react/lib/services/fhir';
import { mapSuccess } from 'fhir-react/lib/services/service';

import config from 'shared/src/config';

import { getToken } from 'src/services/auth';
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
                ? patientMetriportRecordsResponse.error
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
            'data:Endpoint.identifier': `https://fhir.emr.beda.software/CodeSystem/consent-subject|${consentSubject}`,
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
    return service<WearablesData>(
        matchCurrentUserRole({
            [Role.Patient]: () => `${config.wearablesDataStreamService}/api/v1/records`,
            [Role.Admin]: () => `${config.wearablesDataStreamService}/api/v1/${patient.id}/records`,
            [Role.Practitioner]: () => `${config.wearablesDataStreamService}/api/v1/${patient.id}/records`,
            [Role.Receptionist]: () => `${config.wearablesDataStreamService}/api/v1/${patient.id}/records`,
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
    return service<WearablesData>(
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
