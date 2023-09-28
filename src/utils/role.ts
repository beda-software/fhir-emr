import { Organization, Patient, Practitioner } from 'fhir/r4b';
import { WithId } from 'fhir-react';

import { User } from 'shared/src/contrib/aidbox';

import {
    sharedAuthorizedOrganization,
    sharedAuthorizedPatient,
    sharedAuthorizedPractitioner,
    sharedAuthorizedUser,
} from 'src/sharedState';

export enum Role {
    Patient = 'patient',
    Admin = 'admin',
    Practitioner = 'practitioner',
}

export function selectUserRole<T>(user: User, options: { [role in Role]: T }): T {
    const userRole = user.role![0]!.name;

    return options[userRole];
}

export function matchCurrentUserRole<T>(options: {
    [Role.Patient]: (patient: WithId<Patient>) => T;
    [Role.Admin]: (organization: WithId<Organization>) => T;
    [Role.Practitioner]: (patient: WithId<Practitioner>) => T;
}): T {
    return selectUserRole(sharedAuthorizedUser.getSharedState()!, {
        [Role.Admin]: () => options[Role.Admin](sharedAuthorizedOrganization.getSharedState()!),
        [Role.Patient]: () => options[Role.Patient](sharedAuthorizedPatient.getSharedState()!),
        [Role.Practitioner]: () => options[Role.Practitioner](sharedAuthorizedPractitioner.getSharedState()!),
    })();
}

export function selectCurrentUserRoleResource(): WithId<Patient> | WithId<Practitioner> | WithId<Organization> {
    return matchCurrentUserRole<WithId<Patient> | WithId<Practitioner> | WithId<Organization>>({
        [Role.Admin]: (organization) => organization,
        [Role.Practitioner]: (practitioner) => practitioner,
        [Role.Patient]: (patient) => patient,
    });
}
