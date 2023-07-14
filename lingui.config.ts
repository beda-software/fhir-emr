import type { LinguiConfig } from '@lingui/conf';

const config: LinguiConfig = {
    locales: ['en', 'ru'],
    format: 'po',
    catalogs: [
        {
            path: '<rootDir>/shared/src/locale/{locale}/messages',
            include: ['<rootDir>'],
            exclude: ['**/node_modules/**'],
        },
    ],
};

export default config;
