import { addons } from '@storybook/manager-api';
import theme from './theme';

// https://storybook.js.org/docs/react/configure/features-and-behavior
addons.setConfig({
    toolbar: {
        zoom: { hidden: true },
        backgrounds: { hidden: true },
    },
    theme,
});
