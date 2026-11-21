import { defineConfig } from 'vite';

import viteConfig from './vite.config';

// These tests use mocked FHIR requests; the application suite's Aidbox setup must not run.
export default defineConfig((env) => {
    const config = viteConfig(env);
    return {
        ...config,
        test: {
            environment: 'jsdom',
            globals: true,
            setupFiles: [],
            include: ['src/containers/PatientDetails/PatientImaging/**/*.test.{ts,tsx}', 'src/utils/date.test.ts'],
        },
    };
});
