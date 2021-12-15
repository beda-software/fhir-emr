import * as Sentry from '@sentry/browser';

import { setInstanceBaseURL } from 'aidbox-react/src/services/instance';

import config from 'shared/src/config';

if (config.webSentryDSN) {
    Sentry.init({
        dsn: config.webSentryDSN!,
    });
    Sentry.configureScope((scope) => {
        scope.setTag('environment', config.tier);
    });
}

setInstanceBaseURL(config.baseURL);
