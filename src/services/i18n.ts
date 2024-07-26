import { i18n } from '@lingui/core';
import { en, ru } from 'make-plural/plurals';

import { messages as enMessages } from 'src/locale/en/messages';
import { messages as ruMessages } from 'src/locale/ru/messages';

const localMap = {
    en: enMessages,
    ru: ruMessages,
};

export const locales = {
    en: 'English',
    ru: 'Русский',
};

i18n.loadLocaleData({
    en: { plurals: en },
    ru: { plurals: ru },
});

export const getCurrentLocale = () => {
    return localStorage.getItem('locale') || 'en';
};

export const setCurrentLocale = (locale: string) => {
    localStorage.setItem('locale', locale);
};

export function dynamicActivate(locale: string) {
    const messages = localMap[locale];
    if (messages) {
        i18n.load(locale, messages);
    }
    i18n.activate(locale);
}
