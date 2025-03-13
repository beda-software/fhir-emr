import { Resource, Bundle, Reference, QuestionnaireResponse } from 'fhir/r4b';
import { createBrowserHistory } from 'history';

import config from '@beda.software/emr-config';

import { service } from './fhir';

export const history = createBrowserHistory();

export async function loadResourceHistory<R extends Resource>(reference: Reference) {
    return await service<Bundle<R>>({
        url: `${reference.reference}/_history`,
        method: 'GET',
    });
}

export async function popQuestionnaireResponseHistory(id: QuestionnaireResponse['id']) {
    return await service({
        url: `${config.baseURL}/$query/pop-qr-from-history?id=${id}`,
        method: 'GET',
    });
}
