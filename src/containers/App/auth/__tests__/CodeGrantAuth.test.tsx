import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { CodeGrantAuth } from '../CodeGrantAuth';

vi.mock('react-router-dom', () => vi.importActual('react-router-dom'));

describe('CodeGrantAuth on a consumer route', () => {
    it('shows the error when the exchange fails and no failure renderer is given', async () => {
        render(
            <MemoryRouter initialEntries={['/consumer-auth']}>
                <Routes>
                    <Route path="/consumer-auth" element={<CodeGrantAuth />} />
                </Routes>
            </MemoryRouter>,
        );

        expect(await screen.findByText('Unknown error')).toBeInTheDocument();
    });
});
