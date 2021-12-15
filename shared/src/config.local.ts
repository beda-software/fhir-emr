import commonConfig from './config.common';

export default {
    ...commonConfig,

    tier: 'develop',
    baseURL: 'http://localhost:8080',

    webSentryDSN: null,
    mobileSentryDSN: null,
};
