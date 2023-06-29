import { render, waitFor } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

import { getANTDTheme, getAppTheme } from 'src/theme';

import { App } from './';

test('Renders welcome text', async () => {
    const antdTheme = getANTDTheme({ dark: false });
    const appTheme = {
        ...getAppTheme({ dark: false }),
        antdTheme: antdTheme.token,
    };

    const { getByTestId } = render(
        <ThemeProvider theme={appTheme}>
            <App />
        </ThemeProvider>,
    );

    const textElement = getByTestId('app-container');

    await waitFor(() => {
        expect(textElement).toBeInTheDocument();
    });
});
