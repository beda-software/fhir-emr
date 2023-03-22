import { createBrowserHistory } from 'history';

import { WithId } from 'aidbox-react/lib/services/fhir';
import { service } from 'aidbox-react/lib/services/service';

import { AidboxReference, AidboxResource, Bundle } from 'shared/src/contrib/aidbox';

export const history = createBrowserHistory();

export async function loadResourceHistory<R extends AidboxResource>(
    reference: WithId<AidboxReference>,
) {
    return await service<Bundle<R>>({
        url: `${reference.resourceType}/${reference.id}/_history`,
        method: 'GET',
    });
}
