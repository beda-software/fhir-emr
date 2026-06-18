import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
    stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],

    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/addon-interactions',
        '@storybook/addon-styling',
        '@chromatic-com/storybook',
    ],

    framework: {
        name: '@storybook/react-vite',
        options: {},
    },

    docs: {
        autodocs: true,
    },

    typescript: {
        reactDocgen: 'react-docgen-typescript',
    },
};
export default config;
