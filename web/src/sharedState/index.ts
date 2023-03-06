import { createSharedState } from 'aidbox-react/lib/hooks/shared-state';

import { Practitioner } from 'shared/src/contrib/aidbox';

export const sharedAuthorisedPractitioner = createSharedState<Partial<Practitioner> | null>({
    resourceType: 'Practitioner',
});

export const sharedJitsiAuthToken = createSharedState<string>('');
