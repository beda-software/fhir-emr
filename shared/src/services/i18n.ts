import { i18n } from '@lingui/core';
import { en, ru } from 'make-plural/plurals';

export const locales = {
    en: 'EN',
    ru: 'RU',
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

export async function dynamicActivate(locale: string) {
    try {
        const { messages } = await import(`shared/src/locale/${locale}/messages`);
        i18n.load(locale, messages);
    } catch(err){
        console.error(err);
    }
    i18n.activate(locale);
}
