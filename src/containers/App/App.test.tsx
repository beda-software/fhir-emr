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

    const { findByTestId, container } = render(
        <ThemeProvider theme={appTheme}>
            <App />
        </ThemeProvider>,
    );

    expect(await findByTestId('app-container')).toBeInTheDocument();

    // Let EMR finish restoring the session and mount the router before the test ends
    await waitFor(() => expect(container.querySelector('.ant-spin')).not.toBeInTheDocument(), { timeout: 10000 });
});
