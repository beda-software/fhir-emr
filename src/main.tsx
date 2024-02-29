import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import {
    AllergyIntolerance,
    Appointment,
    Condition,
    Consent,
    Immunization,
    MedicationStatement,
    Observation,
    Patient,
    ServiceRequest,
} from 'fhir/r4b';
import moment from 'moment';
import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';

import 'src/services/initialize';

import { formatFHIRDate } from '@beda.software/fhir-react';

import { dynamicActivate, getCurrentLocale } from 'shared/src/services/i18n';

import 'antd/dist/reset.css';
import 'src/styles/index.scss';

import { CreatinineDashoboard } from 'src/components/DashboardCard/creatinine';
import { App } from 'src/containers/App';
import { StandardCard } from 'src/containers/PatientDetails/PatientOverviewDynamic/components/StandardCard';
import { PatientDashboardProvider, Query } from 'src/contexts/PatientDashboardContext';

import { AppointmentCard } from './containers/PatientDetails/PatientOverviewDynamic/components/AppointmentCard';
import { GeneralInformationDashboard } from './containers/PatientDetails/PatientOverviewDynamic/components/GeneralInformationDashboard';
import * as serviceWorker from './serviceWorker';
import { ThemeProvider } from './theme/ThemeProvider';
// import { Role } from './utils/role';

export const dashboard = {
    // TODO WIP
    default: {
        top: [
            {
                query: {
                    resourceType: 'Observation' as Observation['resourceType'],
                    search: (patient: Patient) => ({
                        patient: patient.id,
                        code: 'http://loinc.org|2160-0',
                        _sort: ['-date'],
                    }),
                },
                widget: CreatinineDashoboard,
            },
        ],
        right: [
            {
                query: {
                    resourceType: 'Condition' as Condition['resourceType'],
                    search: (patient: Patient) => ({
                        patient: patient.id,
                        _sort: ['-_recorded-date'],
                        _revinclude: ['Provenance:target'],
                        _count: 7,
                    }),
                },
                widget: StandardCard,
            },
            {
                query: {
                    resourceType: 'AllergyIntolerance' as AllergyIntolerance['resourceType'],
                    search: (patient: Patient) => ({
                        patient: patient.id,
                        _sort: ['-_date'],
                        _revinclude: ['Provenance:target'],
                        _count: 7,
                    }),
                },
                widget: StandardCard,
            },
            {
                query: {
                    resourceType: 'Immunization' as Immunization['resourceType'],
                    search: (patient: Patient) => ({
                        patient: patient.id,
                        _sort: ['-_date'],
                        _revinclude: ['Provenance:target'],
                        _count: 7,
                    }),
                },
                widget: StandardCard,
            },
        ],
        left: [
            {
                query: {
                    resourceType: 'MedicationStatement' as MedicationStatement['resourceType'],
                    search: (patient: Patient) => ({
                        patient: patient.id,
                        _sort: ['-_lastUpdated'],
                        _revinclude: ['Provenance:target'],
                        _count: 7,
                    }),
                },
                widget: StandardCard,
            },
            {
                query: {
                    resourceType: 'Consent' as Consent['resourceType'],
                    search: (patient: Patient) => ({
                        patient: patient.id,
                        status: 'active',
                        _sort: ['-_lastUpdated'],
                        _revinclude: ['Provenance:target'],
                        _count: 7,
                    }),
                },
                widget: StandardCard,
            },
            {
                query: {
                    resourceType: 'Observation' as Observation['resourceType'],
                    search: (patient: Patient) => ({
                        patient: patient.id,
                        status: 'final',
                        code: 'activity-summary',
                        date: `ge${formatFHIRDate(moment().subtract(6, 'days'))}`,
                    }),
                },
                widget: StandardCard,
            },
        ],
        bottom: [
            {
                query: {
                    resourceType: 'ServiceRequest' as ServiceRequest['resourceType'],
                    search: (patient: Patient) => ({
                        subject: patient.id,
                    }),
                },
                widget: StandardCard,
            },
            {
                query: {
                    resourceType: 'Appointment' as Appointment['resourceType'],
                    search: (patient: Patient) => ({
                        actor: patient.id,
                        // date: [`ge${formatFHIRDateTime(moment().startOf('day'))}`],
                        // _revinclude: ['Encounter:appointment'],
                        // 'status:not': ['entered-in-error,cancelled,checked-in'],
                    }),
                },
                widget: AppointmentCard,
            },
            {
                query: {} as Query,
                widget: GeneralInformationDashboard,
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
