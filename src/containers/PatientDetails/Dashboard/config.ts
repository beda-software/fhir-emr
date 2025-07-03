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
    prepareAuERequest,
    prepareReferral,
} from 'src/containers/PatientDetails/PatientOverviewDynamic/components/StandardCard/prepare';
import { GeneralInformationDashboardContainer } from 'src/containers/PatientDetails/PatientOverviewDynamic/containers/GeneralIInformationDashboardContainer';
import { StandardCardContainerFabric } from 'src/containers/PatientDetails/PatientOverviewDynamic/containers/StandardCardContainerFabric';

export const patientDashboardConfig: DashboardInstance = {
    top: [
        {
            widget: GeneralInformationDashboardContainer,
        },
        {
            query: {
                resourceType: 'ServiceRequest',
                search: (patient: Patient) => ({
                    subject: patient.id,
                    _sort: '-_lastUpdated',
                }),
            },
            widget: StandardCardContainerFabric(prepareAuERequest),
        },
        {
            query: {
                resourceType: 'Appointment',
                search: (patient: Patient) => ({
                    status: 'proposed',
                    _sort: '-_lastUpdated',
                    patient: patient.id,
                    _include: 'Appointment:patient',
                    _revinclude: ['CommunicationRequest:based-on', 'QuestionnaireResponse:subject'],
                }),
            },
            widget: StandardCardContainerFabric(prepareReferral),
        },
    ],
    left: [
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
    right: [
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
    ],
    bottom: [],
};
