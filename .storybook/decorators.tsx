import { Decorator } from '@storybook/react';
import { ThemeProvider } from '../src/theme/ThemeProvider';
import React from 'react';

export const withThemeDecorator: Decorator = (Story) => {
    return (
        <ThemeProvider>
            <Story />
        </ThemeProvider>
    );
};
