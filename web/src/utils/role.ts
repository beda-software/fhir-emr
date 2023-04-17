import { WithId } from 'fhir-react';
import { Patient, Practitioner } from 'fhir/r4b';

import { User } from 'shared/src/contrib/aidbox';

import {
    sharedAuthorizedPatient,
    sharedAuthorizedPractitioner,
    sharedAuthorizedUser,
} from 'src/sharedState';

export enum Role {
    Patient = 'patient',
    Admin = 'admin',
}

export function selectUserRole<T>(user: User, options: { [role in Role]: T }): T {
    const userRole = user.role![0]!.name;

    return options[userRole];
}

export function selectCurrentUserRole<T>(options: { [role in Role]: T }) {
    return selectUserRole(sharedAuthorizedUser.getSharedState()!, options);
}

export function selectCurrentUserRoleResource(): WithId<Patient | Practitioner> {
    return selectCurrentUserRole<() => WithId<Patient | Practitioner>>({
        [Role.Admin]: () => sharedAuthorizedPractitioner.getSharedState()!,
        [Role.Patient]: () => sharedAuthorizedPatient.getSharedState()!,
    })();
}
