import { render, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import config from '@beda.software/emr-config';

import { CodeGrantAuth } from '../CodeGrantAuth';

vi.mock('react-router-dom', () => vi.importActual('react-router-dom'));

const mutableConfig = config as unknown as Record<string, unknown>;

describe('CodeGrantAuth on a consumer route', () => {
    afterEach(() => {
        delete mutableConfig.authTokenPath;
        delete mutableConfig.authClientRedirectURL;
    });

    it('renders nothing when the exchange fails and no failure renderer is given', async () => {
        mutableConfig.authTokenPath = 'auth/token';
        mutableConfig.authClientRedirectURL = 'http://localhost:3000/auth';

        const { container } = render(
            <MemoryRouter initialEntries={['/consumer-auth?code=abc']}>
                <Routes>
                    <Route path="/consumer-auth" element={<CodeGrantAuth />} />
                </Routes>
            </MemoryRouter>,
        );

        await waitFor(() => expect(container).toBeEmptyDOMElement());
    });
});
