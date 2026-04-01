import React from 'react';
import { createRoot } from 'react-dom/client';

import 'src/services/initialize';

import 'antd/dist/reset.css';
import 'src/styles/index.scss';

import { PatientDashboardProvider } from 'src/components/Dashboard/contexts';
import { App } from 'src/containers/App';
import { dashboard } from 'src/dashboard.config';

import { ValueSetExpandProvider } from './contexts';
import { expandEMRValueSet } from './services';
import * as serviceWorker from './serviceWorker';
import { ThemeProvider } from './theme/ThemeProvider';

const AppWithContext = () => {
    return (
        <PatientDashboardProvider dashboard={dashboard}>
            <ValueSetExpandProvider.Provider value={expandEMRValueSet}>
                <ThemeProvider>
                    <App />
                </ThemeProvider>
            </ValueSetExpandProvider.Provider>
        </PatientDashboardProvider>
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
