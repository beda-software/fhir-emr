import commonConfig from './config.common';

export default {
    ...commonConfig,

    tier: 'develop',
    baseURL: 'http://localhost:8080',
    sdcIdeUrl: 'http://localhost:3001',

    webSentryDSN: null,
    mobileSentryDSN: null,
};
