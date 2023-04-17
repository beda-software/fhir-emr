import { WithId } from 'fhir-react';
import { useService } from 'fhir-react/lib/hooks/service';
import { failure, success } from 'fhir-react/lib/libs/remoteData';
import { Patient } from 'fhir/r4b';

import config from 'shared/src/config';

import { getToken } from 'src/services/auth';
import { selectCurrentUserRole, Role } from 'src/utils/role';

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
        try {
            return success(
                await fetch(
                    selectCurrentUserRole({
                        [Role.Patient]: `${config.wearablesDataStreamService}/api/v1/records`,
                        [Role.Admin]: `${config.wearablesDataStreamService}/api/v1/${patient.id}/records`,
                    }),
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${getToken()}`,
                        },
                    },
                ).then(
                    (response): Promise<WearablesDataRecord[]> =>
                        response.json().then(({ records }) => records),
                ),
            );
        } catch (err) {
            return failure('Failed to retrieve wearables data');
        }
    }, []);
}
