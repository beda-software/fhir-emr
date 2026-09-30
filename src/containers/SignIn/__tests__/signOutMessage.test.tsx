import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ThemeProvider } from 'src/theme';

import { SignIn } from '../index';

vi.mock('src/services/auth', async () => {
    const actual = await vi.importActual<typeof import('src/services/auth')>('src/services/auth');

    return { ...actual, getSignOutReason: vi.fn() };
});

vi.mock('src/components/BaseLayout/Footer', () => ({ AppFooter: () => null }));

const FORCED = 'You were signed out because there was no activity for a while.';
const EXPIRED = 'Your session has expired. Please sign in again.';

async function renderWithReason(reason: 'forced' | 'expired' | undefined) {
    const { getSignOutReason } = await import('src/services/auth');
    vi.mocked(getSignOutReason).mockReturnValue(reason);
    render(
        <ThemeProvider>
            <SignIn />
        </ThemeProvider>,
    );
}

describe('SignIn sign-out message', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('shows the expired message after an Expired Sign-Out', async () => {
        await renderWithReason('expired');

        expect(screen.getByText(EXPIRED)).toBeInTheDocument();
        expect(screen.queryByText(FORCED)).not.toBeInTheDocument();
    });

    it('keeps the Forced Sign-Out message unchanged', async () => {
        await renderWithReason('forced');

        expect(screen.getByText(FORCED)).toBeInTheDocument();
        expect(screen.queryByText(EXPIRED)).not.toBeInTheDocument();
    });

    it('shows no message after a Manual Sign-Out', async () => {
        await renderWithReason(undefined);

        expect(screen.queryByText(FORCED)).not.toBeInTheDocument();
        expect(screen.queryByText(EXPIRED)).not.toBeInTheDocument();
    });
});
