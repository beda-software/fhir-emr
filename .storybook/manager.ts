import { addons } from '@storybook/manager-api';
import logoUrl from '../src/images/logo.svg';

import { brandColors } from '../src/theme/palette';

// https://storybook.js.org/docs/react/configure/features-and-behavior
addons.setConfig({
    toolbar: {
        zoom: { hidden: true },
        backgrounds: { hidden: true },
    },
    theme: {
        base: 'light',
        brandTitle: 'Beda EMR',
        brandUrl: 'https://emr.beda.software',
        brandImage: logoUrl,
        brandTarget: '_self',

        colorPrimary: brandColors.primary,
        colorSecondary: brandColors.secondary,
    },
});
