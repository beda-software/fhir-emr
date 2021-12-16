const rewireBabelLoader = require('craco-babel-loader');

const path = require('path');

module.exports = {
    plugins: [
        {
            plugin: rewireBabelLoader,
            options: {
                includes: [
                    path.resolve('src'),
                    path.resolve('../shared/src'),
                    path.resolve('../node_modules/aidbox-react/src'),
                    path.resolve('../embed/sdc-ide/shared/src/utils/qrf'),
                ],
            },
        },
    ],
};
