import { addons } from '@storybook/manager-api';

// https://storybook.js.org/docs/react/configure/features-and-behavior
addons.setConfig({
    toolbar: {
        zoom: { hidden: true },
        backgrounds: { hidden: true },
    },
});
