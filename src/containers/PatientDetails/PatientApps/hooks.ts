import { notification } from 'antd';

import { useService } from 'aidbox-react/lib/hooks/service';
import { isSuccess } from 'aidbox-react/lib/libs/remoteData';
import { getFHIRResources as getAidboxResources, extractBundleResources } from 'aidbox-react/lib/services/fhir';
import { mapSuccess, service } from 'aidbox-react/lib/services/service';

import config from 'shared/src/config';
import { Client } from 'shared/src/contrib/aidbox';

import { matchCurrentUserRole, Role } from 'src/utils/role.ts';

export function useSmartApps() {
    const [appsRemoteData] = useService(async () => {
        const resourceType = matchCurrentUserRole<string>({
            [Role.Patient]: () => 'smart-on-fhir-patient',
            [Role.Admin]: () => 'smart-on-fhir',
            [Role.Practitioner]: () => 'smart-on-fhir-practitioner',
            [Role.Receptionist]: () => 'smart-on-fhir-practitioner',
        });
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
