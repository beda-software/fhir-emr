import { notification } from 'antd';

import { useService } from 'aidbox-react/lib/hooks/service';
import { isSuccess } from 'aidbox-react/lib/libs/remoteData';
import { getFHIRResources as getAidboxResources, extractBundleResources } from 'aidbox-react/lib/services/fhir';
import { mapSuccess, service } from 'aidbox-react/lib/services/service';

import config from 'shared/src/config';
import { Client } from 'shared/src/contrib/aidbox';

export function useSmartApps() {
    const [appsRemoteData] = useService(async () => {
        return mapSuccess(
            await getAidboxResources<Client>('Client', { ['.type']: 'smart-on-fhir' }),
            extractBundleResources,
        );
    });
    return { appsRemoteData };
}

interface LaunchProps {
    user: string;
    client: string;
    patient: string;
    practitioner: string | null;
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
            params: { user, iss: encodeURIComponent(`${config.baseURL}/fhir`), client, ctx: { patient, practitioner } },
        },
    });
    if (isSuccess(response)) {
        window.location.href = response.data.result.uri;
    } else {
        notification.error({ message: 'Launch fail', description: JSON.stringify(response.error, undefined, 4) });
    }
}
