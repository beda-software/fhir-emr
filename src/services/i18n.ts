import { i18n } from '@lingui/core';
import type { Locale } from 'antd/es/locale';
import enAntdLocale from 'antd/es/locale/en_US';
import esAntdLocale from 'antd/es/locale/es_ES';
import ruAntdLocale from 'antd/es/locale/ru_RU';
import { en, es, ru } from 'make-plural/plurals';
import { type ReactNode } from 'react';

import { messages as enMessages } from 'src/locale/en/messages';
import { messages as esMessages } from 'src/locale/es/messages';
import { messages as ruMessages } from 'src/locale/ru/messages';

export type LocaleCode = 'en' | 'es' | 'ru';

const localMap = {
    en: enMessages,
    es: esMessages,
    ru: ruMessages,
};

export const locales: Record<string, string> = {
    en: 'English',
    es: 'Español',
    ru: 'Русский',
};

i18n.loadLocaleData({
    en: { plurals: en },
    es: { plurals: es },
    ru: { plurals: ru },
});

export const getCurrentLocale = () => {
    return (localStorage.getItem('locale') || 'en') as LocaleCode;
};

export const setCurrentLocale = (locale: string) => {
    localStorage.setItem('locale', locale);
};

export function dynamicActivate(locale: LocaleCode) {
    const messages = localMap[locale];

    if (messages) {
        i18n.load(locale, messages);
    }

    i18n.activate(locale);
}

export const antdLocaleMap: { [localeCode in LocaleCode]: Locale } = {
    en: enAntdLocale,
    es: esAntdLocale,
    ru: ruAntdLocale,
};

export function getAvailableLocales() {
    return Object.entries(locales).map(([code, label]) => ({ code, label }));
}

export function changeLocale(locale: LocaleCode) {
    setCurrentLocale(locale);
    dynamicActivate(locale);
    location.reload();
}

export interface LocaleConfig {
    getCurrentLocale: () => string;
    getAvailableLocales: () => Array<{ code: string; label: ReactNode }>;
    getLocaleLabel: (code: string) => ReactNode;
    changeLocale: (code: string) => void;
}

export const defaultLocaleConfig: LocaleConfig = {
    getCurrentLocale,
    getAvailableLocales,
    getLocaleLabel: (code: string) => locales[code] ?? code,
    changeLocale: (code: string) => {
        changeLocale(code as LocaleCode);
    },
};
