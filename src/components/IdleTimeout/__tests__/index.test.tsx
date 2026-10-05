import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { SignOutTextsContext } from 'src/components/SignOutTexts';

import { IdleTimeout } from '../index';

vi.mock('@beda.software/emr-config', () => ({
    default: { idleTimeoutMs: 30 * 60 * 1000, warningWindowBeforeIdleTimeoutMs: 2 * 60 * 1000 },
}));

vi.mock('../hooks', async () => {
    const actual = await vi.importActual<typeof import('../hooks')>('../hooks');

    return {
        ...actual,
        useIdleTimeout: () => ({
            state: 'warning',
            recordProviderActivity: vi.fn(),
            signOutNow: vi.fn(),
        }),
    };
});

describe('IdleTimeout Warning Window texts', () => {
    it('falls back to the default, translated texts when none are given', () => {
        render(<IdleTimeout />);

        expect(screen.getByText('Your session is about to end')).toBeInTheDocument();
        expect(
            screen.getByText(
                "You've been inactive for a while. For your security, your session will end soon unless you stay signed in.",
            ),
        ).toBeInTheDocument();
        expect(screen.getByText('Stay signed in')).toBeInTheDocument();
        expect(screen.getByText('Sign out now')).toBeInTheDocument();
    });

    it('uses given texts in place of the defaults', () => {
        render(
            <SignOutTextsContext.Provider
                value={{
                    warningWindow: {
                        title: 'Custom title',
                        body: 'Custom body',
                        stayLabel: 'Custom stay label',
                        signOutLabel: 'Custom sign-out label',
                    },
                }}
            >
                <IdleTimeout />
            </SignOutTextsContext.Provider>,
        );

        expect(screen.getByText('Custom title')).toBeInTheDocument();
        expect(screen.getByText('Custom body')).toBeInTheDocument();
        expect(screen.getByText('Custom stay label')).toBeInTheDocument();
        expect(screen.getByText('Custom sign-out label')).toBeInTheDocument();
    });

    it('falls back to individual defaults for texts left out', () => {
        render(
            <SignOutTextsContext.Provider value={{ warningWindow: { title: 'Custom title' } }}>
                <IdleTimeout />
            </SignOutTextsContext.Provider>,
        );

        expect(screen.getByText('Custom title')).toBeInTheDocument();
        expect(screen.getByText('Stay signed in')).toBeInTheDocument();
        expect(screen.getByText('Sign out now')).toBeInTheDocument();
    });
});
