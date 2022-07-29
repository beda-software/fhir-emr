import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';

import 'src/services/initialize';

import { dynamicActivate, getCurrentLocale } from 'shared/src/services/i18n';

import { App } from 'src/containers/App';
import 'src/styles/index.scss';
import 'shared/src/services/i18n';

import * as serviceWorker from './serviceWorker';

const I18nApp = () => {
    useEffect(() => {
        dynamicActivate(getCurrentLocale());
    }, []);

    return (
        <I18nProvider i18n={i18n}>
            <App />
        </I18nProvider>
    );
};

const container = document.getElementById('root');
if(container){
    const root = createRoot(container);

    root.render(
        <React.StrictMode>
            <I18nApp />
        </React.StrictMode>
    );
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
