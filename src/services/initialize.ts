import * as Sentry from '@sentry/browser';

import { setInstanceBaseURL as setAidboxInstanceBaseURL } from 'aidbox-react/lib/services/instance';

import config from '@beda.software/emr-config';

if (config.webSentryDSN) {
    Sentry.init({
        dsn: config.webSentryDSN!,
    });
    Sentry.configureScope((scope) => {
        scope.setTag('environment', config.tier);
    });
}

setAidboxInstanceBaseURL(config.baseURL);
