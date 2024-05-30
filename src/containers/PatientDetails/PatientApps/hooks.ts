import { notification } from 'antd';
import { Organization, Patient, Practitioner } from 'fhir/r4b';

import { useService } from 'aidbox-react/lib/hooks/service';
import { isSuccess } from 'aidbox-react/lib/libs/remoteData';
import { getFHIRResources as getAidboxResources, extractBundleResources } from 'aidbox-react/lib/services/fhir';
import { mapSuccess, service } from 'aidbox-react/lib/services/service';

import { WithId } from '@beda.software/fhir-react';

import config from 'shared/src/config';
import { Client } from 'shared/src/contrib/aidbox';

type CurrentUser = WithId<Patient> | WithId<Practitioner> | WithId<Organization>;

export function useSmartApps(currentUser: CurrentUser) {
    const [appsRemoteData] = useService(async () => {
        let resourceType = 'smart-on-fhir';
        if (currentUser.resourceType === 'Patient') {
            resourceType = 'smart-on-fhir-patient';
        } else if (currentUser.resourceType === 'Practitioner') {
            resourceType = 'smart-on-fhir-practitioner';
        }
        return mapSuccess(
            await getAidboxResources<Client>('Client', { ['.type']: resourceType }),
            extractBundleResources,
        );
    });
    return { appsRemoteData };
}

export interface LaunchProps {
    user: string;
    client: string;
    patient: string;
    practitioner?: string;
}

interface LaunchRPCResult {
    result: {
        uri: string;
    };
}

export async function launch({ user, client, patient, practitioner }: LaunchProps) {
    const response = await service<LaunchRPCResult>({
        url: '/rpc',
        method: 'POST',
        data: {
            method: 'aidbox.smart/get-launch-uri',
            params: { user, iss: encodeURIComponent(`${config.baseURL}/fhir`), client, ctx: { patient, ...(practitioner ? {practitioner} : {}) } },
        },
    });
    if (isSuccess(response)) {
        window.location.href = response.data.result.uri;
    } else {
        notification.error({ message: 'Launch fail', description: JSON.stringify(response.error, undefined, 4) });
    }
}
