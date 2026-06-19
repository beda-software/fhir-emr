import { Organization, ParametersParameter, Patient, Practitioner } from 'fhir/r4b';
import { useMemo } from 'react';

import { User } from '@beda.software/aidbox-types';
import { WithId } from '@beda.software/fhir-react';

import {
    sharedAuthorizedOrganization,
    sharedAuthorizedPatient,
    sharedAuthorizedPractitioner,
    sharedAuthorizedUser,
} from 'src/sharedState';
import { resourceToClinicalContext } from 'src/utils/clinicalContext';
import { Role } from 'src/utils/role';

type UserRoleResource = WithId<Patient> | WithId<Practitioner> | WithId<Organization>;

function getUserRoleResource(user: User): UserRoleResource | undefined {
    const role = user.role![0]!.name as Role;
    switch (role) {
        case Role.Admin:
            return sharedAuthorizedOrganization.getSharedState();
        case Role.Practitioner:
        case Role.Receptionist:
            return sharedAuthorizedPractitioner.getSharedState();
        case Role.Patient:
            return sharedAuthorizedPatient.getSharedState();
        default:
            return undefined;
    }
}

export function defaultToUserClinicalContext(): ParametersParameter[] {
    const user = sharedAuthorizedUser.getSharedState();
    if (!user?.role?.length) {
        return [];
    }

    const resource = getUserRoleResource(user);
    if (!resource) {
        return [];
    }

    return [
        ...resourceToClinicalContext('User', resource),
        ...resourceToClinicalContext(resource.resourceType, resource),
        ...resourceToClinicalContext('Author', resource),
    ];
}

export function useCurrentUserRoleResource(): UserRoleResource | null {
    const [user] = sharedAuthorizedUser.useSharedState();
    const [patient] = sharedAuthorizedPatient.useSharedState();
    const [practitioner] = sharedAuthorizedPractitioner.useSharedState();
    const [organization] = sharedAuthorizedOrganization.useSharedState();

    return useMemo(() => {
        if (!user?.role?.length) {
            return null;
        }
        const role = user.role[0]!.name as Role;
        switch (role) {
            case Role.Admin:
                return organization ?? null;
            case Role.Practitioner:
            case Role.Receptionist:
                return practitioner ?? null;
            case Role.Patient:
                return patient ?? null;
            default:
                return null;
        }
    }, [user, patient, practitioner, organization]);
}

export function useDefaultUserClinicalContext(): ParametersParameter[] {
    const resource = useCurrentUserRoleResource();

    return useMemo(() => {
        if (!resource) {
            return [];
        }
        return [
            ...resourceToClinicalContext('User', resource),
            ...resourceToClinicalContext(resource.resourceType, resource),
            ...resourceToClinicalContext('Author', resource),
        ];
    }, [resource]);
}
