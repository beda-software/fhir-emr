import { Patient } from 'fhir/r4b';
import moment from 'moment';

import 'src/services/initialize';

import { formatFHIRDate } from '@beda.software/fhir-react';

import 'antd/dist/reset.css';
import 'src/styles/index.scss';

import { AppointmentCardContainer } from 'src/containers/PatientDetails/PatientOverviewDynamic/containers/AppointmentCardContainer';
import { CreatinineDashoboardContainer } from 'src/containers/PatientDetails/PatientOverviewDynamic/containers/CreatinineDashoboardContainer';
import { GeneralInformationDashboardContainer } from 'src/containers/PatientDetails/PatientOverviewDynamic/containers/GeneralIInformationDashboardContainer';
import { StandardCardContainerFabric } from 'src/containers/PatientDetails/PatientOverviewDynamic/containers/StandardCardContainerFabric';
import { WidgetInfo } from 'src/contexts/PatientDashboardContext';

import {
    prepareActivitySummary,
    prepareAllergies,
    prepareConditions,
    prepareConsents,
    prepareImmunizations,
    prepareMedications,
    prepareSeriveRequest,
} from './containers/PatientDetails/PatientOverviewDynamic/utils';
// import { Role } from './utils/role';

type DashboardAreas = 'top' | 'right' | 'left' | 'bottom';

interface Dashboard {
    default: Record<DashboardAreas, WidgetInfo[]>;
}

export const dashboard: Dashboard = {
    default: {
        top: [
            {
                query: {
                    resourceType: 'Observation',
                    search: (patient: Patient) => ({
                        patient: patient.id,
                        code: 'http://loinc.org|2160-0',
                        _sort: ['-date'],
                    }),
                },
                widget: CreatinineDashoboardContainer,
            },
        ],
        right: [
            {
                query: {
                    resourceType: 'Condition',
                    search: (patient: Patient) => ({
                        patient: patient.id,
                        _sort: ['-_recorded-date'],
                        _revinclude: ['Provenance:target'],
                        _count: 7,
                    }),
                },
                widget: StandardCardContainerFabric(prepareConditions),
            },
            {
                query: {
                    resourceType: 'AllergyIntolerance',
                    search: (patient: Patient) => ({
                        patient: patient.id,
                        _sort: ['-_date'],
                        _revinclude: ['Provenance:target'],
                        _count: 7,
                    }),
                },
                widget: StandardCardContainerFabric(prepareAllergies),
            },
            {
                query: {
                    resourceType: 'Immunization',
                    search: (patient: Patient) => ({
                        patient: patient.id,
                        _sort: ['-_date'],
                        _revinclude: ['Provenance:target'],
                        _count: 7,
                    }),
                },
                widget: StandardCardContainerFabric(prepareImmunizations),
            },
        ],
        left: [
            {
                query: {
                    resourceType: 'MedicationStatement',
                    search: (patient: Patient) => ({
                        patient: patient.id,
                        _sort: ['-_lastUpdated'],
                        _revinclude: ['Provenance:target'],
                        _count: 7,
                    }),
                },
                widget: StandardCardContainerFabric(prepareMedications),
            },
            {
                query: {
                    resourceType: 'Consent',
                    search: (patient: Patient) => ({
                        patient: patient.id,
                        status: 'active',
                        _sort: ['-_lastUpdated'],
                        _revinclude: ['Provenance:target'],
                        _count: 7,
                    }),
                },
                widget: StandardCardContainerFabric(prepareConsents),
            },
            {
                query: {
                    resourceType: 'Observation',
                    search: (patient: Patient) => ({
                        patient: patient.id,
                        status: 'final',
                        code: 'activity-summary',
                        date: `ge${formatFHIRDate(moment().subtract(6, 'days'))}`,
                    }),
                },
                widget: StandardCardContainerFabric(prepareActivitySummary),
            },
        ],
        bottom: [
            {
                query: {
                    resourceType: 'ServiceRequest',
                    search: (patient: Patient) => ({
                        subject: patient.id,
                    }),
                },
                widget: StandardCardContainerFabric(prepareSeriveRequest),
            },
            {
                query: {
                    resourceType: 'Appointment',
                    search: (patient: Patient) => ({
                        actor: patient.id,
                        // date: [`ge${formatFHIRDateTime(moment().startOf('day'))}`],
                        // _revinclude: ['Encounter:appointment'],
                        // 'status:not': ['entered-in-error,cancelled,checked-in'],
                    }),
                },
                widget: AppointmentCardContainer,
            },
            {
                widget: GeneralInformationDashboardContainer,
            },
        ],
    },
    // [Role.Admin]: {},
    // [Role.Practitioner]: {},
};
