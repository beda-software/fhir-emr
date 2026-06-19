import { Organization, Patient, Practitioner, PractitionerRole } from 'fhir/r4b';

import { User } from '@beda.software/aidbox-types';
import { WithId, createSharedState } from '@beda.software/fhir-react';

export const sharedAuthorizedUser = createSharedState<User | undefined>(undefined);

export const sharedAuthorizedPatient = createSharedState<WithId<Patient> | undefined>(undefined);

export const sharedAuthorizedPractitioner = createSharedState<WithId<Practitioner> | undefined>(undefined);
export const sharedAuthorizedPractitionerRoles = createSharedState<WithId<PractitionerRole>[] | undefined>(undefined);

export const sharedAuthorizedOrganization = createSharedState<WithId<Organization> | undefined>(undefined);

export const sharedJitsiAuthToken = createSharedState<string>('');
