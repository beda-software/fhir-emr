const path = require('path');

module.exports = {
    framework: '@storybook/react',
    stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
    addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
    webpackFinal: async (config) => {
        config.resolve.modules = [
            ...(config.resolve.modules || []),
            path.resolve(__dirname, '../'),
        ];

        config.module.rules.push({
            test: /\.s(a|c)ss$/,
            include: path.resolve(__dirname, '../'),
            use: [
                'style-loader',
                {
                    loader: 'css-loader',
                    options: {
                        modules: {
                            auto: true,
                            localIdentName: '[name]__[local]--[hash:base64:5]',
                        },
                    },
                },
                'sass-loader',
            ],
        });

        return config;
    },
    core: {
        builder: 'webpack5',
    },
};
