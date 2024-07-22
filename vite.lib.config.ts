import path from 'path';

import { lingui } from '@lingui/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
    plugins: [
        react({
            babel: {
                plugins: [
                    'macros',
                    [
                        'babel-plugin-styled-components',
                        {
                            displayName: true,
                            fileName: true,
                            meaninglessFileNames: ['index', 'styles'],
                        },
                    ],
                ],
            },
        }),
        lingui(),
        dts({ entryRoot: 'src' }),
    ],
    resolve: {
        alias: [
            { find: 'src', replacement: path.resolve(__dirname, './src/') },
            { find: 'shared', replacement: path.resolve(__dirname, './shared/') },
        ],
    },
    build: {
        copyPublicDir: false,
        lib: {
            entry: [path.resolve(__dirname, 'src/index.ts'), path.resolve(__dirname, 'src/components.index.ts')],
            formats: ['es'],
            fileName: (format, entryName) => `${entryName}.js`,
        },
        rollupOptions: {
            // Ensure external dependencies are not bundled into your library
            external: ['react', 'react-dom'],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                },
            },
        },
    },
});
