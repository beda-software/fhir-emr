import { Patient, Practitioner } from 'fhir/r4b';

import { isFailure, isSuccess, success } from 'aidbox-react/lib/libs/remoteData';
import { getFHIRResource } from 'aidbox-react/lib/services/fhir';
import { resetInstanceToken, setInstanceToken } from 'aidbox-react/lib/services/instance';
import { extractErrorCode, formatError } from 'aidbox-react/lib/utils/error';

import { User } from 'shared/src/contrib/aidbox';

import { getJitsiAuthToken, getUserInfo } from 'src/services/auth';
import {
    sharedAuthorizedPatient,
    sharedAuthorizedPractitioner,
    sharedAuthorizedUser,
    sharedJitsiAuthToken,
} from 'src/sharedState';
import { Role, selectUserRole } from 'src/utils/role';

async function populateUserInfoSharedState(user: User) {
    sharedAuthorizedUser.setSharedState(user);

    const fetchUserRoleDetails = selectUserRole(user, {
        [Role.Admin]: async () => {
            const practitionerId = user.role![0]!.links!.practitioner!.id;
            const practitionerResponse = await getFHIRResource<Practitioner>({
                resourceType: 'Practitioner',
                id: practitionerId,
            });
            if (isSuccess(practitionerResponse)) {
                sharedAuthorizedPractitioner.setSharedState(practitionerResponse.data);
            } else {
                console.error(practitionerResponse.error);
            }
        },
        [Role.Patient]: async () => {
            const patientId = user.role![0]!.links!.patient!.id;
            const patientResponse = await getFHIRResource<Patient>({
                resourceType: 'Patient',
                id: patientId,
            });
            if (isSuccess(patientResponse)) {
                sharedAuthorizedPatient.setSharedState(patientResponse.data);
            } else {
                console.error(patientResponse.error);
            }
        },
    });
    await fetchUserRoleDetails();
}

export async function restoreUserSession(token: string) {
    setInstanceToken({ access_token: token, token_type: 'Bearer' });

    const userResponse = await getUserInfo();

    if (isSuccess(userResponse)) {
        await populateUserInfoSharedState(userResponse.data);

        const jitsiAuthTokenResponse = await getJitsiAuthToken();
        if (isSuccess(jitsiAuthTokenResponse)) {
            sharedJitsiAuthToken.setSharedState(jitsiAuthTokenResponse.data.jwt);
        }
        if (isFailure(jitsiAuthTokenResponse)) {
            console.warn(
                'Error, while fetching Jitsi auth token: ',
                formatError(jitsiAuthTokenResponse.error),
            );
        }
    } else {
        if (extractErrorCode(userResponse.error) !== 'network_error') {
            resetInstanceToken();

            return success(null);
        }
    }

    return userResponse;
}
