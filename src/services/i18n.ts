import { i18n } from '@lingui/core';
import type { Locale as AntdLocale } from 'antd/es/locale';
import enAntdLocale from 'antd/es/locale/en_US';
import esAntdLocale from 'antd/es/locale/es_ES';
import ruAntdLocale from 'antd/es/locale/ru_RU';

import { messages as enMessages } from 'src/locale/en/messages';
import { messages as esMessages } from 'src/locale/es/messages';
import { messages as ruMessages } from 'src/locale/ru/messages';

export const getCurrentLocale = () => {
    return localStorage.getItem('locale') || 'en';
};

export const setCurrentLocale = (locale: string) => {
    localStorage.setItem('locale', locale);
};

export function dynamicActivate(localeCode: string, localesConfig: LocalesConfig) {
    const messages = localesConfig[localeCode]?.messages;

    if (messages) {
        i18n.load(localeCode, messages);
    }

    i18n.activate(localeCode);
}

/**
 * @deprecated Use `LocalesConfig` and access `antdLocale` from the locale entry instead.
 */
export const antdLocaleMap: Record<string, AntdLocale> = {
    en: enAntdLocale,
    es: esAntdLocale,
    ru: ruAntdLocale,
};

export function changeLocale(locale: string, localesConfig: LocalesConfig) {
    setCurrentLocale(locale);
    dynamicActivate(locale, localesConfig);
    location.reload();
}

export interface LocaleData {
    label: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    messages: any;
    antdLocale: AntdLocale;
}

export type LocalesConfig = Record<string, LocaleData>;

export const defaultLocalesConfig: LocalesConfig = {
    ru: {
        label: 'Русский',
        messages: ruMessages,
        antdLocale: ruAntdLocale,
    },
    en: {
        label: 'English',
        messages: enMessages,
        antdLocale: enAntdLocale,
    },
    es: {
        label: 'Español',
        messages: esMessages,
        antdLocale: esAntdLocale,
    },
};
