import { useService } from 'fhir-react/lib/hooks/service';
import { failure, isFailure, success } from 'fhir-react/lib/libs/remoteData';
import { WithId, getFHIRResources } from 'fhir-react/lib/services/fhir';
import { extractBundleResources } from 'fhir-react/lib/services/fhir';
import { mapSuccess } from 'fhir-react/lib/services/service';
import { Consent, Patient, Practitioner } from 'fhir/r4b';

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
}

export function usePatientWearablesData(patient: WithId<Patient>) {
    return useService(async () => {
        const consentResponse = await matchCurrentUserRole({
            [Role.Admin]: (practitioner: WithId<Practitioner>) =>
                fetchConsentStatus(practitioner, patient, 'emr-datasequence-records'),
            [Role.Patient]: () => Promise.resolve(success({ hasConsent: true })),
        });

        if (isFailure(consentResponse)) {
            return consentResponse;
        }

        try {
            return success({
                hasConsent: consentResponse.data.hasConsent,
                records: consentResponse.data.hasConsent ? await fetchPatientRecords(patient) : [],
            });
        } catch (err) {
            return failure('Failed to retrieve wearables data');
        }
    }, []);
}

async function fetchConsentStatus(actor: WithId<Practitioner>, patient: WithId<Patient>, consentSubject: string) {
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
    return fetch(
        matchCurrentUserRole({
            [Role.Patient]: () => `${config.wearablesDataStreamService}/api/v1/records`,
            [Role.Admin]: () => `${config.wearablesDataStreamService}/api/v1/${patient.id}/records`,
        }),
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        },
    ).then((response): Promise<WearablesDataRecord[]> => response.json().then(({ records }) => records));
}
