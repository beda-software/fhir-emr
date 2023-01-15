import { render } from '@testing-library/react';

import { App } from './';

test('Renders welcome text', async () => {
    const { findByTestId } = render(<App />);

    const textElement = await findByTestId('app-container');

    expect(textElement).toBeInTheDocument();
});
