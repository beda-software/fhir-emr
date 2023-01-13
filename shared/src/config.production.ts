import commonConfig from './config.common';

export default {
    ...commonConfig,

    tier: 'production',
    baseURL: 'https://aidbox.fhir-emr.beda.software',
    sdcIdeUrl: 'https://sdc.beda.software',

    webSentryDSN: null,
    mobileSentryDSN: null,
};
