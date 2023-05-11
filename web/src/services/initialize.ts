import * as Sentry from '@sentry/browser';
import { setInstanceBaseURL as setFHIRInstanceBaseURL } from 'fhir-react/lib/services/instance';

import { setInstanceBaseURL as setAidboxInstanceBaseURL } from 'aidbox-react/lib/services/instance';

import config from 'shared/src/config';

if (config.webSentryDSN) {
    Sentry.init({
        dsn: config.webSentryDSN!,
    });
    Sentry.configureScope((scope) => {
        scope.setTag('environment', config.tier);
    });
}

setFHIRInstanceBaseURL(config.baseURL + '/fhir');
setAidboxInstanceBaseURL(config.baseURL);
