import { ThemeConfig } from 'antd';
import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    mode: 'dark' | 'light';
    antdTheme?: ThemeConfig['token'];
    primary: string;
    secondary: string;
    link: string;
    success: string;
    warning: string;
    error: string;
    neutral: {
        title: string;
        primaryText: string;
        secondaryText: string;
        disable: string;
        border: string;
        dividers: string;
        background: string;
        tableHeader: string;

        sidebarBackground: string,
    };
    primaryPalette: {
        bcp_1: string;
        bcp_2: string;
        bcp_3: string;
        bcp_4: string;
        bcp_5: string;
        bcp_6: string;
        bcp_7: string;
        bcp_8: string;
        bcp_9: string;
        bcp_10: string;
    };
    secondaryPalette: {
        bcs_1: string;
        bcs_2: string;
        bcs_3: string;
        bcs_4: string;
        bcs_5: string;
        bcs_6: string;
        bcs_7: string;
        bcs_8: string;
        bcs_9: string;
        bcs_10: string;
    };
    neutralPalette: {
        gray_1: string;
        gray_2: string;
        gray_3: string;
        gray_4: string;
        gray_5: string;
        gray_6: string;
        gray_7: string;
        gray_8: string;
        gray_9: string;
        gray_10: string;
        gray_11: string;
        gray_12: string;
        gray_13: string;
    };
    iconColors: {
        primary: string;
        secondary: string;
    };
  }
}