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

function getRoleResourceForUser(user: User): UserRoleResource | undefined {
    const role = user.role![0]!.name as Role;
    try {
        switch (role) {
            case Role.Admin:
                return sharedAuthorizedOrganization.getSharedState() ?? undefined;
            case Role.Practitioner:
            case Role.Receptionist:
                return sharedAuthorizedPractitioner.getSharedState() ?? undefined;
            case Role.Patient:
                return sharedAuthorizedPatient.getSharedState() ?? undefined;
            default:
                return undefined;
        }
    } catch {
        return undefined;
    }
}

function getUserRoleResource(user: User): UserRoleResource | undefined {
    return getRoleResourceForUser(user);
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

    return useMemo(() => {
        if (!user?.role?.length) {
            return null;
        }
        return getRoleResourceForUser(user) ?? null;
    }, [user]);
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
