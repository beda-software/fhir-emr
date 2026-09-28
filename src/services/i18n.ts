import { i18n } from '@lingui/core';
import type { Locale } from 'antd/es/locale';
import deAntdLocale from 'antd/es/locale/de_DE';
import enAntdLocale from 'antd/es/locale/en_US';
import esAntdLocale from 'antd/es/locale/es_ES';
import ruAntdLocale from 'antd/es/locale/ru_RU';

import config, { type LocalesConfig } from '@beda.software/emr-config';

import { messages as deMessages } from 'src/locale/de/messages';
import { messages as enMessages } from 'src/locale/en/messages';
import { messages as esMessages } from 'src/locale/es/messages';
import { messages as ruMessages } from 'src/locale/ru/messages';

export const getCurrentLocale = () => {
    return localStorage.getItem('locale') || config.defaultLocale || 'en';
};

export const setCurrentLocale = (locale: string) => {
    localStorage.setItem('locale', locale);
};

export function dynamicActivate(locale: string) {
    const localeData = localesConfig[locale];

    if (localeData) {
        i18n.load(locale, localeData.messages);
    }

    i18n.activate(locale);
}

/**
 * @deprecated Use `localesConfig` and access `antdLocale` from the locale entry instead.
 */
export const antdLocaleMap: { [code: string]: Locale } = {
    en: enAntdLocale,
    es: esAntdLocale,
    ru: ruAntdLocale,
};

const defaultLocalesConfig: LocalesConfig = {
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
    de: {
        label: 'Deutsch',
        messages: deMessages,
        antdLocale: deAntdLocale,
    },
};

export const localesConfig = config.localesConfig ?? defaultLocalesConfig;
