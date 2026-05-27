import { createRequire } from 'module';
import * as path from 'path';

import { lingui } from '@lingui/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import turbosnap from 'vite-plugin-turbosnap';

const require = createRequire(import.meta.url);

function ortWasmCopyTargets() {
    try {
        const ortDist = path.dirname(require.resolve('onnxruntime-web'));
        return [{ src: path.join(ortDist, 'ort-wasm-simd-threaded*.{wasm,mjs}'), dest: 'ort' }];
    } catch {
        console.warn(
            '[vite] onnxruntime-web not resolved — ORT wasm not copied; the local Assistant engine will not work.',
        );
        return [];
    }
}

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
    server: {
        port: command === 'build' ? 5000 : 3000,
    },
    plugins: [
        ...[
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
            viteStaticCopy({ targets: ortWasmCopyTargets() }),
        ],
        command === 'build' ? [turbosnap({ rootDir: process.cwd() })] : [],
    ],
    define: {
        'process.env': {},
    },
    resolve: {
        alias: [{ find: 'src', replacement: path.resolve(__dirname, './src/') }],
    },
    css: {
        preprocessorOptions: {
            scss: {
                silenceDeprecations: ['legacy-js-api'],
            },
        },
    },
    build: {
        outDir: path.resolve(__dirname, 'build'),
        commonjsOptions: {
            defaultIsModuleExports(id) {
                try {
                    const module = require(id);
                    if (module?.default) {
                        return false;
                    }
                    return 'auto';
                } catch (error) {
                    return 'auto';
                }
            },
            transformMixedEsModules: true,
        },
    },
    test: {
        globals: true, // To use the Vitest APIs globally like Jest
        environment: 'jsdom', // https://vitest.dev/config/#environment
        setupFiles: 'src/setupTests.ts', //  https://vitest.dev/config/#setupfiles
        server: {
            deps: {
                inline: [/@beda\.software\/fhir-questionnaire/, /@beda\.software\/web-item-controls/],
            },
        },
    },
}));
