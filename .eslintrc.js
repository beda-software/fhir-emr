module.exports = {
    env: {
        // 'jest/globals': true,
        browser: true,
        serviceworker: true,
    },
    globals: {
        HTMLButtonElement: 'readonly',
        JSX: true,
    },
    root: true,
    extends: ['react-app', 'prettier'],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'import'],
    rules: {
        'react/jsx-uses-react': 'off',
        'react/react-in-jsx-scope': 'off',
        'no-restricted-imports': ['error', { patterns: ['shared/lib', 'aidbox-react/src'] }],
        'prettier/prettier': 0,
        'import/order': [
            'error',
            {
                groups: ['builtin', 'external', 'internal', ['index', 'sibling', 'parent']],
                'newlines-between': 'always',
                pathGroupsExcludedImportTypes: ['builtin'],
                pathGroups: [
                    {
                        pattern: 'aidbox-react/**',
                        group: 'external',
                        position: 'after',
                    },
                    {
                        pattern: 'shared/**',
                        group: 'internal',
                        position: 'after',
                    },
                    {
                        pattern: 'src/**',
                        group: 'internal',
                        position: 'after',
                    },
                ],
                alphabetize: { order: 'asc', caseInsensitive: true },
            },
        ],
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': [
            'error',
            { builtinGlobals: false, hoist: 'functions', allow: [], ignoreOnInitialization: false },
        ],
    },
};
