import { Organization, Patient, Practitioner, PractitionerRole } from 'fhir/r4b';

import { User } from '@beda.software/aidbox-types';
import config from '@beda.software/emr-config';
import { extractBundleResources, extractErrorCode, formatError } from '@beda.software/fhir-react';
import { isFailure, isSuccess, RemoteDataResult, success } from '@beda.software/remote-data';

import type { SignOutReason } from 'src/services/auth';
import { getJitsiAuthToken, getUserInfo } from 'src/services/auth';
import {
    axiosInstance,
    getFHIRResource,
    getFHIRResources,
    resetInstanceToken,
    setInstanceToken,
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

export async function fetchUserRoleDetails(user: User) {
    const userRoleDetailsInitializer = selectUserRole(user, {
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

    await userRoleDetailsInitializer();
}

export async function aidboxPopulateUserInfoSharedState(): Promise<RemoteDataResult<User>> {
    const userResponse = await getUserInfo();

    if (isFailure(userResponse)) {
        return userResponse;
    }
    const user = userResponse.data;

    sharedAuthorizedUser.setSharedState(user);

    if (user.role) {
        await fetchUserRoleDetails(user);
    }

    return userResponse;
}

export interface RestoreUserSessionDeps {
    isIdleTimeoutElapsed: () => boolean;
    refreshSession: () => Promise<string | undefined>;
    endSession: (reason: SignOutReason) => void | Promise<void>;
}

// The failure result drops the HTTP status, so a 401 is observed on the shared client instead.
async function populateAndDetectRejection(populate: () => Promise<RemoteDataResult<User>>) {
    let rejected = false;
    const id = axiosInstance.interceptors.response.use(undefined, (error) => {
        rejected ||= error?.response?.status === 401;

        return Promise.reject(error);
    });

    try {
        return { response: await populate(), rejected };
    } finally {
        axiosInstance.interceptors.response.eject(id);
    }
}

export async function restoreUserSession(
    token: string,
    populateUserInfoSharedState = aidboxPopulateUserInfoSharedState,
    deps?: RestoreUserSessionDeps,
): Promise<RemoteDataResult> {
    setInstanceToken({ access_token: token, token_type: 'Bearer' });

    let { response, rejected } = await populateAndDetectRejection(populateUserInfoSharedState);

    if (deps && isFailure(response) && rejected) {
        if (deps.isIdleTimeoutElapsed()) {
            await deps.endSession('forced');

            return success(null);
        }

        const freshToken = await deps.refreshSession().catch(() => null);
        if (freshToken === undefined) {
            resetInstanceToken();

            return success(null);
        }
        if (freshToken !== null) {
            ({ response, rejected } = await populateAndDetectRejection(populateUserInfoSharedState));
        }
        if (freshToken === null || (isFailure(response) && rejected)) {
            await deps.endSession('expired');

            return success(null);
        }
    }

    if (isSuccess(response)) {
        if (config.jitsiMeetServer) {
            const jitsiAuthTokenResponse = await getJitsiAuthToken();
            if (isSuccess(jitsiAuthTokenResponse)) {
                sharedJitsiAuthToken.setSharedState(jitsiAuthTokenResponse.data.jwt);
            }
            if (isFailure(jitsiAuthTokenResponse)) {
                console.warn('Error, while fetching Jitsi auth token: ', formatError(jitsiAuthTokenResponse.error));
            }
        }
    } else {
        if (extractErrorCode(response.error) !== 'network_error') {
            resetInstanceToken();

            return success(null);
        }
    }

    return response;
}
