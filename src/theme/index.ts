import { getPalette } from './palette';

export * from './antd-theme';
export * from './ThemeProvider';

export function getAppTheme({ dark }: { dark?: boolean }) {
    const palette = getPalette({ dark });

    return palette;
}
