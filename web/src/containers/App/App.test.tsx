import { render, waitFor } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

import { getAppTheme } from 'src/theme';

import { App } from './';

test('Renders welcome text', async () => {
    const { getByTestId } = render(
        <ThemeProvider
            theme={{
                mode: 'light',
                ...getAppTheme({ dark: false }),
            }}
        >
            <App />
        </ThemeProvider>,
    );

    const textElement = getByTestId('app-container');

    await waitFor(() => {
        expect(textElement).toBeInTheDocument();
    });
});
