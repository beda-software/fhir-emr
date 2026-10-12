import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import config from '@beda.software/emr-config';

import { ThemeProvider } from 'src/theme';

import { SignIn } from '../index';

vi.mock('src/components/BaseLayout/Footer', () => ({ AppFooter: () => null }));

const mutableConfig = config as unknown as Record<string, unknown>;

describe('SignIn when the PKCE challenge cannot be built', () => {
    const originalLocation = window.location;

    beforeEach(() => {
        mutableConfig.authFlow = 'code';
        mutableConfig.authTokenPath = 'auth/token';
        mutableConfig.authClientRedirectURL = 'http://localhost:3000/auth';
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: { href: 'http://localhost:3000/signin' },
        });
    });

    afterEach(() => {
        Object.defineProperty(window, 'location', { configurable: true, value: originalLocation });
        delete mutableConfig.authFlow;
        delete mutableConfig.authTokenPath;
        delete mutableConfig.authClientRedirectURL;
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    it('shows an error and does not redirect when Web Crypto is unavailable', async () => {
        vi.stubGlobal('crypto', { getRandomValues: crypto.getRandomValues.bind(crypto), subtle: undefined });
        render(
            <ThemeProvider>
                <SignIn />
            </ThemeProvider>,
        );

        await userEvent.click(screen.getByRole('button', { name: 'Log in' }));

        expect(await screen.findByText(/secure browser cryptography is unavailable/)).toBeInTheDocument();
        expect(window.location.href).toBe('http://localhost:3000/signin');
    });
});
