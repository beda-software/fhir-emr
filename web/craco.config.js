const path = require('path');

const rewireBabelLoader = require('craco-babel-loader');

module.exports = {
    plugins: [
        {
            plugin: rewireBabelLoader,
            options: {
                includes: [
                    path.resolve('src'),
                    path.resolve('../shared/src'),
                    path.resolve('../node_modules/aidbox-react/src'),
                ],
            },
        },
    ],
};