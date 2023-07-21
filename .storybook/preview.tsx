import 'antd/dist/reset.css';
import 'src/styles/index.scss';
import { Preview } from '@storybook/react';
import { withThemeDecorator } from './decorators';

const preview: Preview = {
    parameters: {
        options: {
            storySort: {
                order: ['Theme', 'components', '*'],
            },
        },
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
