import { useEffect, useState } from 'react';

const getTheme = (): 'light' | 'dark' => {
    const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    return isDark ? 'dark' : 'light';
};

export function useTheme() {
    const [theme, setTheme] = useState<'light' | 'dark'>(getTheme());

    const onChange = (e: MediaQueryListEvent) => {
        const isDark = e.matches;

        setTheme(isDark ? 'dark' : 'light');
    };

    useEffect(() => {
        const matchMedia = window.matchMedia('(prefers-color-scheme: dark)');
        matchMedia.addEventListener('change', onChange);

        return () => {
            matchMedia.removeEventListener('change', onChange);
        };
    }, []);

    return { theme };
}
