import { render, screen } from '@testing-library/react';
import { useLocation } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { SignOutTexts, SignOutTextsContext } from 'src/components/SignOutTexts';
import { ThemeProvider } from 'src/theme';

import { SignIn } from '../index';

vi.mock('src/components/BaseLayout/Footer', () => ({ AppFooter: () => null }));

const EXPIRED = 'Your session has expired. Please sign in again.';

async function renderWithReason(reason: 'expired' | undefined, signOutTexts?: SignOutTexts) {
    vi.mocked(useLocation).mockReturnValue({
        pathname: '/signin',
        search: '',
        hash: '',
        key: 'default',
        state: reason ? { signOutReason: reason } : null,
    });
    render(
        <SignOutTextsContext.Provider value={signOutTexts}>
            <ThemeProvider>
                <SignIn />
            </ThemeProvider>
        </SignOutTextsContext.Provider>,
    );
}

describe('SignIn sign-out message', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('shows the expired message after an Expired Sign-Out', async () => {
        await renderWithReason('expired');

        expect(screen.getByText(EXPIRED)).toBeInTheDocument();
    });

    it("shows the consuming app's expired message instead of the default", async () => {
        await renderWithReason('expired', { expiredSignOutMessage: 'Custom expiry text' });

        expect(screen.getByText('Custom expiry text')).toBeInTheDocument();
        expect(screen.queryByText(EXPIRED)).not.toBeInTheDocument();
    });

    it('shows no message after a Manual Sign-Out', async () => {
        await renderWithReason(undefined);

        expect(screen.queryByText(EXPIRED)).not.toBeInTheDocument();
    });
});
