module.exports = {
    env: {
        browser: true,
        es2020: true,
        serviceworker: true,
    },
    globals: {
        HTMLButtonElement: 'readonly',
        JSX: true,
    },
    root: true,
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:import/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:storybook/recommended',
        'eslint-config-prettier',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: 'tsconfig.json',
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    ignorePatterns: ['.eslintrc.cjs'],
    settings: {
        'import/resolver': {
            'eslint-import-resolver-custom-alias': {
                alias: {
                    src: './src',
                },
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            },
        },
    },
    plugins: ['react', '@typescript-eslint', 'react-refresh', 'prettier', 'import', 'string-to-lingui'],
    rules: {
        'react-refresh/only-export-components': 'warn',
        '@typescript-eslint/no-explicit-any': 'warn',
        'react/jsx-uses-react': 'off',
        'react/react-in-jsx-scope': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        'string-to-lingui/t-call-in-function': 2,
        'import/no-unresolved': [
            2,
            {
                ignore: ['fhir/r4b', '@beda.software/emr-config', '@beda.software/aidbox-types', '@mdxeditor/editor'], // Fixes error: Unable to resolve path to module 'fhir/r4b'.
            },
        ],
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
                        pattern: '@beda.software/**',
                        group: 'external',
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
    },
};
