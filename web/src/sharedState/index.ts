import { createSharedState } from 'aidbox-react/lib/hooks/shared-state';
import { WithId } from 'aidbox-react/lib/services/fhir';

import { Practitioner } from 'shared/src/contrib/aidbox';

export const sharedAuthorizedPractitioner = createSharedState<WithId<Practitioner> | undefined>(
    undefined,
);

export const sharedJitsiAuthToken = createSharedState<string>('');

export const sharedAppleIdentityToken = createSharedState<string>('');
