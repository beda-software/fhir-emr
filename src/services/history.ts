
import { service } from 'fhir-react/lib/services/service';
import { Resource, Bundle, Reference } from 'fhir/r4b';
import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();

export async function loadResourceHistory<R extends Resource>(
    reference: Reference,
) {
    return await service<Bundle<R>>({
        url: `${reference.reference}/_history`,
        method: 'GET',
    });
}
