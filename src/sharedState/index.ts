import { Organization, Patient, Practitioner, PractitionerRole } from 'fhir/r4b';

import { User } from '@beda.software/aidbox-types';
import { WithId, createSharedState } from '@beda.software/fhir-react';

export const sharedAuthorizedUser = createSharedState<User | undefined>(undefined);

export const sharedAuthorizedPatient = createSharedState<WithId<Patient> | undefined>(undefined);

export const sharedAuthorizedPractitioner = createSharedState<WithId<Practitioner> | undefined>(undefined);
export const sharedAuthorizedPractitionerRoles = createSharedState<WithId<PractitionerRole>[] | undefined>(undefined);

export const sharedAuthorizedOrganization = createSharedState<WithId<Organization> | undefined>(undefined);

/** The FHIR resource for the currently authenticated user (Practitioner, Patient, or Organization).
 *  Initialized to null so useSharedState() never throws before auth completes. */
export const sharedCurrentUserRoleResource = createSharedState<WithId<Patient | Practitioner | Organization> | null>(
    null,
);

export const sharedJitsiAuthToken = createSharedState<string>('');
