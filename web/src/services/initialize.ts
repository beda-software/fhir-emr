import * as Sentry from '@sentry/browser';
import { setInstanceBaseURL as setFHIRBaseURL } from 'fhir-react/lib/services/instance';

import { setInstanceBaseURL as setAidboxBaseURL } from 'aidbox-react/lib/services/instance';

import config from 'shared/src/config';

if (config.webSentryDSN) {
    Sentry.init({
        dsn: config.webSentryDSN!,
    });
    Sentry.configureScope((scope) => {
        scope.setTag('environment', config.tier);
    });
}

setFHIRBaseURL(config.baseURL + '/fhir');
setAidboxBaseURL(config.baseURL);
