import { Patient } from 'fhir/r4b';
import moment from 'moment';

import { formatFHIRDate } from '@beda.software/fhir-react';

import { DashboardInstance } from 'src/components/Dashboard/types';
import {
    prepareActivitySummary,
    prepareAllergies,
    prepareConditions,
    prepareConsents,
    prepareImmunizations,
    prepareMedications,
    prepareSeriveRequest,
} from 'src/containers/PatientDetails/PatientOverviewDynamic/components/StandardCard/prepare';
import { AppointmentCardContainer } from 'src/containers/PatientDetails/PatientOverviewDynamic/containers/AppointmentCardContainer';
import { CreatinineDashoboardContainer } from 'src/containers/PatientDetails/PatientOverviewDynamic/containers/CreatinineDashoboardContainer';
import { GeneralInformationDashboardContainer } from 'src/containers/PatientDetails/PatientOverviewDynamic/containers/GeneralIInformationDashboardContainer';
import { StandardCardContainerFabric } from 'src/containers/PatientDetails/PatientOverviewDynamic/containers/StandardCardContainerFabric';
import { PrepareFunction } from 'src/containers/PatientDetails/PatientOverviewDynamic/containers/StandardCardContainerFabric/hooks';

export const patientDashboardConfig: DashboardInstance = {
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
            widget: StandardCardContainerFabric(prepareConditions as PrepareFunction),
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
            widget: StandardCardContainerFabric(prepareAllergies as PrepareFunction),
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
            widget: StandardCardContainerFabric(prepareImmunizations as PrepareFunction),
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
            widget: StandardCardContainerFabric(prepareMedications as PrepareFunction),
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
            widget: StandardCardContainerFabric(prepareConsents as PrepareFunction),
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
            widget: StandardCardContainerFabric(prepareActivitySummary as PrepareFunction),
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
            widget: StandardCardContainerFabric(prepareSeriveRequest as PrepareFunction),
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
};
