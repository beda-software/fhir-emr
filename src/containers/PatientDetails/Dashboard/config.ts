import { Patient } from 'fhir/r4b';

import { DashboardInstance } from 'src/components/Dashboard/types';
import {
    prepareAllergies,
    prepareConditions,
    prepareImmunizations,
    prepareMedications,
    prepareProcedures,
} from 'src/containers/PatientDetails/PatientOverviewDynamic/components/StandardCard/prepare';
import { AppointmentCardContainer } from 'src/containers/PatientDetails/PatientOverviewDynamic/containers/AppointmentCardContainer';
import { GeneralInformationDashboardContainer } from 'src/containers/PatientDetails/PatientOverviewDynamic/containers/GeneralIInformationDashboardContainer';
import { StandardCardContainerFabric } from 'src/containers/PatientDetails/PatientOverviewDynamic/containers/StandardCardContainerFabric';

import { CreatinineDashboardContainer } from '../PatientOverviewDynamic/containers/CreatinineDashboardContainer';

export const patientDashboardConfig: DashboardInstance = {
    top: [
        {
            widget: AppointmentCardContainer,
            query: {
                resourceType: 'Appointment',
                search: (patient: Patient) => ({
                    patient: patient.id,
                    status: ['arrived,booked'],
                }),
            },
        },
        {
            widget: GeneralInformationDashboardContainer,
        },
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
                    _sort: ['-date'],
                    _revinclude: ['Provenance:target'],
                    _count: 7,
                }),
            },
            widget: StandardCardContainerFabric(prepareAllergies),
        },
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
                resourceType: 'Immunization',
                search: (patient: Patient) => ({
                    patient: patient.id,
                    status: 'completed',
                    _sort: ['-date'],
                    _revinclude: ['Provenance:target'],
                    _count: 7,
                }),
            },
            widget: StandardCardContainerFabric(prepareImmunizations),
        },
        {
            query: {
                resourceType: 'Procedure',
                search: (patient: Patient) => ({
                    subject: patient.id,
                    _sort: ['-date', '_id'],
                    _revinclude: ['Provenance:target'],
                }),
            },
            widget: StandardCardContainerFabric(prepareProcedures),
        },
    ],
    left: [],
    right: [],
    bottom: [
        {
            widget: CreatinineDashboardContainer,
        },
    ],
};
