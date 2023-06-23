import { getPalette } from './palette';

export * from './antd-theme';

export function getAppTheme({ dark }: { dark?: boolean }) {
    const palette = getPalette({ dark });

    return palette;
}
