import { User } from 'shared/src/contrib/aidbox';

import { sharedAuthorizedUser } from 'src/sharedState';

export enum Role {
    Patient = 'patient',
    Admin = 'admin',
}

export function selectUserRole<T>(user: User, options: { [role in Role]: T }) {
    const userRole = user.role?.[0]?.name;

    return userRole ? options[userRole] : undefined;
}

export function selectCurrentUserRole<T>(options: { [role in Role]: T }) {
    return selectUserRole(sharedAuthorizedUser.getSharedState()!, options);
}
