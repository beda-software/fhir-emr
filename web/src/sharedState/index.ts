import { createSharedState } from 'fhir-react/lib/hooks/shared-state';
import { WithId } from 'fhir-react/lib/services/fhir';
import { Patient, Practitioner } from 'fhir/r4b';

import { User } from 'shared/src/contrib/aidbox';

export const sharedAuthorizedUser = createSharedState<User | undefined>(undefined);

export const sharedAuthorizedPatient = createSharedState<WithId<Patient> | undefined>(undefined);

export const sharedAuthorizedPractitioner =
    createSharedState<WithId<Practitioner> | undefined>(undefined);

export const sharedJitsiAuthToken = createSharedState<string>('');
