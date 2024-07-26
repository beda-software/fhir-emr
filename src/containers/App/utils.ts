import { Organization, Patient, Practitioner, PractitionerRole } from 'fhir/r4b';

import {
    resetInstanceToken as resetAidboxInstanceToken,
    setInstanceToken as setAidboxInstanceToken,
} from 'aidbox-react/lib/services/instance';

import { User } from '@beda.software/aidbox-types';
import { extractBundleResources, extractErrorCode, formatError } from '@beda.software/fhir-react';
import { isFailure, isSuccess, RemoteDataResult, success } from '@beda.software/remote-data';

import { getJitsiAuthToken, getUserInfo } from 'src/services/auth';
import {
    getFHIRResource,
    getFHIRResources,
    resetInstanceToken as resetFHIRInstanceToken,
    setInstanceToken as setFHIRInstanceToken,
} from 'src/services/fhir';
import {
    sharedAuthorizedOrganization,
    sharedAuthorizedPatient,
    sharedAuthorizedPractitioner,
    sharedAuthorizedPractitionerRoles,
    sharedAuthorizedUser,
    sharedJitsiAuthToken,
} from 'src/sharedState';
import { Role, selectUserRole } from 'src/utils/role';

async function populateUserInfoSharedState(user: User) {
    sharedAuthorizedUser.setSharedState(user);

    if (!user.role) {
        return Promise.resolve();
    }

    const fetchUserRoleDetails = selectUserRole(user, {
        [Role.Admin]: async () => {
            const organizationId = user.role![0]!.links!.organization!.id;
            const organizationResponse = await getFHIRResource<Organization>({
                reference: `Organization/${organizationId}`,
            });
            if (isSuccess(organizationResponse)) {
                sharedAuthorizedOrganization.setSharedState(organizationResponse.data);
            } else {
                console.error(organizationResponse.error);
            }
        },
        [Role.Practitioner]: async () => {
            const practitionerId = user.role![0]!.links!.practitioner!.id;
            const practitionerResponse = await getFHIRResource<Practitioner>({
                reference: `Practitioner/${practitionerId}`,
            });

            if (isSuccess(practitionerResponse)) {
                sharedAuthorizedPractitioner.setSharedState(practitionerResponse.data);
            } else {
                console.error(practitionerResponse.error);
            }

            const practitionerRolesResponse = await getFHIRResources<PractitionerRole>('PractitionerRole', {
                practitioner: `Practitioner/${practitionerId}`,
            });

            if (isSuccess(practitionerRolesResponse)) {
                const practitionerRoles = extractBundleResources(practitionerRolesResponse.data).PractitionerRole;
                sharedAuthorizedPractitionerRoles.setSharedState(practitionerRoles);
            } else {
                console.error(practitionerRolesResponse.error);
            }
        },
        [Role.Receptionist]: async () => {
            const practitionerId = user.role![0]!.links!.practitioner!.id;
            const practitionerResponse = await getFHIRResource<Practitioner>({
                reference: `Practitioner/${practitionerId}`,
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
                reference: `Patient/${patientId}`,
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

export async function restoreUserSession(token: string): Promise<RemoteDataResult> {
    setAidboxInstanceToken({ access_token: token, token_type: 'Bearer' });
    setFHIRInstanceToken({ access_token: token, token_type: 'Bearer' });

    const userResponse = await getUserInfo();

    if (isSuccess(userResponse)) {
        await populateUserInfoSharedState(userResponse.data);

        const jitsiAuthTokenResponse = await getJitsiAuthToken();
        if (isSuccess(jitsiAuthTokenResponse)) {
            sharedJitsiAuthToken.setSharedState(jitsiAuthTokenResponse.data.jwt);
        }
        if (isFailure(jitsiAuthTokenResponse)) {
            console.warn('Error, while fetching Jitsi auth token: ', formatError(jitsiAuthTokenResponse.error));
        }
    } else {
        if (extractErrorCode(userResponse.error) !== 'network_error') {
            resetAidboxInstanceToken();
            resetFHIRInstanceToken();

            return success(null);
        }
    }

    return userResponse;
}
