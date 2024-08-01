import type { LinguiConfig } from '@lingui/conf';

const config: LinguiConfig = {
    locales: ['en', 'es', 'ru'],
    format: 'po',
    catalogs: [
        {
            path: '<rootDir>/src/locale/{locale}/messages',
            include: ['<rootDir>/src'],
            exclude: ['**/node_modules/**'],
        },
    ],
};

export default config;
