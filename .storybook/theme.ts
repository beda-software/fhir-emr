import { create } from '@storybook/theming/create';
import logoUrl from '../src/images/logo.svg';

import { brandColors } from '../src/theme/palette';

export default create({
    base: 'light',
    brandTitle: 'Beda EMR',
    brandUrl: 'https://emr.beda.software',
    brandImage: logoUrl,
    brandTarget: '_self',

    colorPrimary: brandColors.primary,
    colorSecondary: brandColors.primary,
});
