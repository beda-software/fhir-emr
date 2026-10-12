import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useLocation } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { success } from '@beda.software/remote-data';

import { getSignInUrl } from 'src/services/auth';
import { ThemeProvider } from 'src/theme';

import { SignIn } from '../index';

vi.mock('src/components/BaseLayout/Footer', () => ({ AppFooter: () => null }));
vi.mock('src/services/auth', async () => {
    const actual = await vi.importActual<typeof import('src/services/auth')>('src/services/auth');

    return { ...actual, getSignInUrl: vi.fn() };
});

let locationSpy: { mockRestore: () => void };

function renderAt(state: unknown, props: { originPathName?: string } = {}) {
    vi.mocked(useLocation).mockReturnValue({ pathname: '/signin', search: '', hash: '', key: 'default', state });
    vi.mocked(getSignInUrl).mockResolvedValue(success('http://localhost/authorize'));
    locationSpy = vi.spyOn(window, 'location', 'get').mockReturnValue({ href: '' } as Location);
    render(
        <ThemeProvider>
            <SignIn {...props} />
        </ThemeProvider>,
    );
}

describe('SignIn nextUrl', () => {
    afterEach(() => {
        locationSpy.mockRestore();
        vi.clearAllMocks();
    });

    it('signs in towards the URL the redirect to /signin came from', async () => {
        renderAt({ nextUrl: '/patients/1?tab=notes' });

        await userEvent.click(screen.getByRole('button', { name: 'Log in' }));

        expect(getSignInUrl).toHaveBeenCalledWith({ nextUrl: '/patients/1?tab=notes' });
    });

    it('falls back to the originPathName prop without redirect state', async () => {
        renderAt(null, { originPathName: '/custom' });

        await userEvent.click(screen.getByRole('button', { name: 'Log in' }));

        expect(getSignInUrl).toHaveBeenCalledWith({ nextUrl: '/custom' });
    });
});
