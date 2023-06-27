import { theme as ANTDTheme, ThemeConfig } from 'antd';

import { colors, getPalette } from './palette';

export function getANTDTheme({ dark }: { dark?: boolean }): ThemeConfig {
    const palette = getPalette({ dark });

    return {
        token: {
            colorPrimary: colors.primary,
            colorLink: palette.link,
            colorLinkHover: palette.primaryPalette.bcp_5,
            colorLinkActive: palette.primaryPalette.bcp_7,
            colorError: palette.error,
            colorSuccess: palette.success,
            colorWarning: palette.warning,
            colorInfo: palette.primaryPalette.bcp_6,
        },
        algorithm: dark ? ANTDTheme.darkAlgorithm : ANTDTheme.defaultAlgorithm,
        components: {
            Layout: {
                colorBgHeader: dark ? '#141414' : '#fff',
                colorBgBody: palette.primaryPalette.bcp_1,
            },
        },
    };
}
