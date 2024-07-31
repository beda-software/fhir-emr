import { i18n } from '@lingui/core';
import { en, es, ru } from 'make-plural/plurals';

import { messages as enMessages } from 'src/locale/en/messages';
import { messages as esMessages } from 'src/locale/es/messages';
import { messages as ruMessages } from 'src/locale/ru/messages';

export type LocaleCode = 'en' | 'es' | 'ru';

const localMap = {
    en: enMessages,
    es: esMessages,
    ru: ruMessages,
};

export const locales = {
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
