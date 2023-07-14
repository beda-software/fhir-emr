import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';
import matchers from '@testing-library/jest-dom/matchers';
import { expect } from 'vitest';

// Was done to fix error:
// Property 'toBeInTheDocument' does not exist on type 'Assertion<HTMLElement>'
// https://github.com/testing-library/jest-dom/issues/439
// https://github.com/testing-library/jest-dom/issues/427
declare module 'vitest' {
    interface Assertion<T = any> extends jest.Matchers<void, T>, TestingLibraryMatchers<T, void> {}
}

expect.extend(matchers);
