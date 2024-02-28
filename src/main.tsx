import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';

import 'src/services/initialize';

import { dynamicActivate, getCurrentLocale } from 'shared/src/services/i18n';

import 'antd/dist/reset.css';
import 'src/styles/index.scss';

import { CreatinineDashoboard } from 'src/components/DashboardCard/creatinine';
import { App } from 'src/containers/App';
import { StandardCard } from 'src/containers/PatientDetails/PatientOverviewDynamic/components/StandardCard';
import { PatientDashboardProvider } from 'src/contexts/PatientDashboardContext';

import * as serviceWorker from './serviceWorker';
import { ThemeProvider } from './theme/ThemeProvider';
// import { Role } from './utils/role';

export const dashboard = {
    // TODO WIP
    default: {
        top: [
            {
                query: {
                    resourceType: 'Observation',
                    search: {
                        text: 'TOP CARD 1',
                    },
                },
                widget: StandardCard,
            },
            {
                query: {
                    resourceType: 'Observation',
                    search: {
                        text: 'TOP CARD 2',
                    },
                },
                widget: StandardCard,
            },
            {
                query: {
                    resourceType: 'Observation',
                    search: {
                        code: 'http://loinc.org|2160-0',
                        _sort: ['-date'],
                    },
                },
                widget: CreatinineDashoboard,
            },
            {
                query: {
                    resourceType: 'Observation',
                    search: {
                        text: 'TOP CARD 3',
                    },
                },
                widget: StandardCard,
            },
            {
                query: {
                    resourceType: 'Observation',
                    search: {
                        code: 'http://loinc.org|2160-0',
                        _sort: ['-date'],
                    },
                },
                widget: CreatinineDashoboard,
            },
        ],
        right: [
            {
                query: {
                    resourceType: 'Observation',
                    search: {
                        text: 'RIGHT CARD 1',
                    },
                },
                widget: StandardCard,
            },
            {
                query: {
                    resourceType: 'Observation',
                    search: {
                        text: 'RIGHT CARD 2',
                    },
                },
                widget: StandardCard,
            },
            {
                query: {
                    resourceType: 'Observation',
                    search: {
                        text: 'RIGHT CARD 3',
                    },
                },
                widget: StandardCard,
            },
        ],
        left: [
            {
                query: {
                    resourceType: 'Observation',
                    search: {
                        text: 'LEFT CARD 1',
                    },
                },
                widget: StandardCard,
            },
        ],
        bottom: [
            {
                query: {
                    resourceType: 'Observation',
                    search: {
                        text: 'BOTTOM CARD 1',
                    },
                },
                widget: StandardCard,
            },
        ],
    },
    // [Role.Admin]: {},
    // [Role.Practitioner]: {},
};

const AppWithContext = () => {
    useEffect(() => {
        dynamicActivate(getCurrentLocale());
    }, []);

    return (
        <I18nProvider i18n={i18n}>
            <PatientDashboardProvider dashboard={dashboard}>
                <ThemeProvider>
                    <App />
                </ThemeProvider>
            </PatientDashboardProvider>
        </I18nProvider>
    );
};

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <AppWithContext />
    </React.StrictMode>,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
