import { render, waitFor } from '@testing-library/react';

import { App } from './';

test('Renders welcome text', async () => {
    const { getByTestId } = render(<App />);

    const textElement = getByTestId('app-container');

    await waitFor(() => {
        expect(textElement).toBeInTheDocument();
    });
});
