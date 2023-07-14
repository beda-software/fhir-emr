import { ConfigProvider as ANTDConfigProvider } from 'antd';
import { ReactNode, useEffect } from 'react';
import { ThemeProvider as StyledComponentsThemeProvider, createGlobalStyle } from 'styled-components';

import { dynamicActivate, getCurrentLocale } from 'shared/src/services/i18n';

import { getAppTheme, getANTDTheme } from './';
import { useTheme } from '../utils/theme';

interface Props {
    children: ReactNode;
}

const GlobalStyle = createGlobalStyle<{ $whiteColor?: boolean }>`
  :root {
    --theme-icon-primary: ${({ theme }) => theme.primaryPalette.bcp_6};
    --theme-icon-secondary: ${({ theme }) => theme.secondaryPalette.bcs_6};
    --theme-sidebar-background: ${({ theme }) => theme.neutral.sidebarBackground};
  }

  body {
    background-color: ${({ theme }) => theme.antdTheme?.colorBgBase};
  }
`;

export function ThemeProvider(props: Props) {
    const { children } = props;

    useEffect(() => {
        dynamicActivate(getCurrentLocale());
    }, []);

    const { theme } = useTheme();
    const dark = theme === 'dark';

    const antdTheme = getANTDTheme({ dark: dark });
    const appTheme = {
        ...getAppTheme({ dark: dark }),
        mode: theme,
        antdTheme: antdTheme.token,
    };

    return (
        <ANTDConfigProvider theme={antdTheme}>
            <StyledComponentsThemeProvider theme={appTheme}>
                <GlobalStyle />
                {children}
            </StyledComponentsThemeProvider>
        </ANTDConfigProvider>
    );
}
