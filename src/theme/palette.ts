import * as ANTDColors from '@ant-design/colors';
import _ from 'lodash';
import { DefaultTheme } from 'styled-components';

export const brandColors: Pick<DefaultTheme, 'primary' | 'secondary'> = {
    primary: '#3366ff',
    secondary: '#05BDB1',
};

const fcColors: Pick<DefaultTheme, 'link' | 'success' | 'warning' | 'error'> = {
    link: brandColors.primary,
    success: '#52C41A',
    warning: '#FAAD14',
    error: '#FF4D4F',
};

export const colors = {
    ...brandColors,
    ...fcColors,
};

const neutralColors = {
    light: {
        title: 'rgba(0,0,0,0.85)',
        primaryText: 'rgba(0,0,0,0.85)',
        secondaryText: 'rgba(0,0,0,0.45)',
        disable: 'rgba(0,0,0,0.25)',
        border: 'rgba(0,0,0,0.15)',
        dividers: 'rgba(0,0,0,0.06)',
        background: 'rgba(0,0,0,0.04)',
        tableHeader: 'rgba(0,0,0,0.02)',

        sidebarBackground: '#fff',
    },
    dark: {
        title: 'rgba(255,255,255,0.85)',
        primaryText: 'rgba(255,255,255,0.85)',
        secondaryText: 'rgba(255,255,255,0.45)',
        disable: 'rgba(255,255,255,0.30)',
        border: 'rgba(255,255,255,0.20)',
        dividers: 'rgba(255,255,255,0.12)',
        background: 'rgba(255,255,255,0.08)',
        tableHeader: 'rgba(255,255,255,0.04)',

        sidebarBackground: '#141414',
    },
};

const neutralPalette: {
    light: DefaultTheme['neutralPalette'];
    dark: DefaultTheme['neutralPalette'];
} = {
    light: {
        gray_1: '#ffffff',
        gray_2: '#fafafa',
        gray_3: '#f5f5f5',
        gray_4: '#f0f0f0',
        gray_5: '#d9d9d9',
        gray_6: '#bfbfbf',
        gray_7: '#8c8c8c',
        gray_8: '#595959',
        gray_9: '#434343',
        gray_10: '#262626',
        gray_11: '#1f1f1f',
        gray_12: '#141414',
        gray_13: '#000000',
    },
    dark: {
        gray_13: '#ffffff',
        gray_12: '#fafafa',
        gray_11: '#f5f5f5',
        gray_10: '#f0f0f0',
        gray_9: '#d9d9d9',
        gray_8: '#bfbfbf',
        gray_7: '#8c8c8c',
        gray_6: '#595959',
        gray_5: '#434343',
        gray_4: '#262626',
        gray_3: '#1f1f1f',
        gray_2: '#141414',
        gray_1: '#000000',
    },
};

export function getPalette({ dark }: { dark?: boolean }): DefaultTheme {
    const primaryPalette = _.fromPairs(
        ANTDColors.generate(brandColors.primary, {
            theme: dark ? 'dark' : undefined,
        }).map((c, index) => [`bcp_${index + 1}`, c]),
    ) as DefaultTheme['primaryPalette'];
    const secondaryPalette = _.fromPairs(
        ANTDColors.generate(brandColors.secondary, {
            theme: dark ? 'dark' : undefined,
        }).map((c, index) => [`bcs_${index + 1}`, c]),
    ) as DefaultTheme['secondaryPalette'];
    const iconColors: {
        light: DefaultTheme['iconColors'];
        dark: DefaultTheme['iconColors'];
    } = {
        light: {
            primary: primaryPalette.bcp_6,
            secondary: secondaryPalette.bcs_2,
        },
        dark: {
            primary: neutralPalette.dark.gray_12,
            secondary: neutralPalette.dark.gray_6,
        },
    };

    return {
        ..._.chain(colors)
            .toPairs()
            .map(([name, color]) => [
                name,
                ANTDColors.generate(color, {
                    theme: dark ? 'dark' : undefined,
                })[5],
            ])
            .fromPairs()
            .value(),
        neutral: {
            ...(dark ? neutralColors.dark : neutralColors.light),
        },
        neutralPalette: {
            ...(dark ? neutralPalette.dark : neutralPalette.light),
        },
        iconColors: {
            ...(dark ? iconColors.dark : iconColors.light),
        },
        primaryPalette,
        secondaryPalette,
    } as DefaultTheme;
}
