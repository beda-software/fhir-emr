import * as Sentry from '@sentry/browser';

import config from '@beda.software/emr-config';
import { setInstanceBaseURL } from 'src/services/fhir';

if (config.webSentryDSN) {
    Sentry.init({
        dsn: config.webSentryDSN!,
    });
    Sentry.configureScope((scope) => {
        scope.setTag('environment', config.tier);
    });
}

setInstanceBaseURL(config.baseURL);
