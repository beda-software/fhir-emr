import 'antd/dist/reset.css';
import { Preview } from '@storybook/react';
import { withThemeDecorator } from './decorators';

const preview: Preview = {
    parameters: {
        layout: 'fullscreen',
        actions: { argTypesRegex: '^on[A-Z].*' },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/,
            },
        },
    },
    decorators: [withThemeDecorator],
};

export const globalTypes = {
    scheme: {
        name: 'Scheme',
        description: 'Select dark or light scheme',
        defaultValue: 'both',
        toolbar: {
            icon: 'mirror',
            items: ['light', 'dark', 'both'],
            dynamicTitle: true,
        },
    },
};

export default preview;
