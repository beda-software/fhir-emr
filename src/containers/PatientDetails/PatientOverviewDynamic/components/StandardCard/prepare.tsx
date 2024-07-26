import { AlertOutlined, ExperimentOutlined, HeartOutlined, TeamOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { t } from '@lingui/macro';
import {
    AllergyIntolerance,
    Appointment,
    Bundle,
    Condition,
    Encounter,
    Immunization,
    MedicationStatement,
    Provenance,
    Consent,
    Observation,
    ServiceRequest,
} from 'fhir/r4b';
import _ from 'lodash';
import moment from 'moment';

import { WithId, extractBundleResources, formatFHIRDate, parseFHIRDateTime } from '@beda.software/fhir-react';

import { PatientActivitySummary } from 'src/containers/PatientDetails/PatientActivitySummary';
import { LinkToEdit } from 'src/containers/PatientDetails/PatientOverviewDynamic/components/LinkToEdit';
import { OverviewCard } from 'src/containers/PatientDetails/PatientOverviewDynamic/components/StandardCard/types';
import medicationIcon from 'src/containers/PatientDetails/PatientOverviewDynamic/images/medication.svg';
import { extractExtension, fromFHIRReference } from 'src/utils/converter';
import { formatHumanDate } from 'src/utils/date';

export function prepareAllergies(
    allergies: AllergyIntolerance[],
    provenanceList: Provenance[],
    total?: number,
): OverviewCard<AllergyIntolerance> {
    return {
        title: t`Allergies`,
        key: 'allergies',
        icon: <ExperimentOutlined />,
        data: allergies,
        total,
        getKey: (r: AllergyIntolerance) => r.id!,
        columns: [
            {
                title: t`Name`,
                key: 'name',
                render: (resource: AllergyIntolerance) => (
                    <LinkToEdit
                        name={resource.code?.coding?.[0]?.display}
                        resource={resource}
                        provenanceList={provenanceList}
                    />
                ),
            },
            {
                title: t`Date`,
                key: 'date',
                render: (r: AllergyIntolerance) => {
                    const createdAt = extractExtension(r.meta?.extension, 'ex:createdAt');

                    return createdAt ? formatHumanDate(r.recordedDate || createdAt) : null;
                },
                width: 120,
            },
        ],
    };
}

export function prepareConditions(
    conditions: Condition[],
    provenanceList: Provenance[],
    total?: number,
): OverviewCard<Condition> {
    return {
        title: t`Conditions`,
        key: 'conditions',
        icon: <AlertOutlined />,
        data: conditions,
        total,
        getKey: (r: Condition) => r.id!,
        columns: [
            {
                title: t`Name`,
                key: 'name',
                render: (resource: Condition) => (
                    <LinkToEdit
                        name={resource.code?.text || resource.code?.coding?.[0]?.display}
                        resource={resource}
                        provenanceList={provenanceList}
                    />
                ),
            },
            {
                title: t`Date`,
                key: 'date',
                render: (r: Condition) => {
                    const createdAt = extractExtension(r.meta?.extension, 'ex:createdAt');

                    return createdAt ? formatHumanDate(r.recordedDate || createdAt) : null;
                },
                width: 120,
            },
        ],
    };
}

export function prepareConsents(
    consents: Consent[],
    provenanceList: Provenance[],
    total?: number,
): OverviewCard<Consent> {
    return {
        title: t`Consents`,
        key: 'consents',
        icon: <TeamOutlined />,
        data: consents,
        total,
        getKey: (r: Consent) => r.id!,
        columns: [
            {
                title: t`Name`,
                key: 'name',
                render: (resource: Consent) => {
                    const provisionName = resource.provision?.data?.[0]?.reference.display;
                    const purposeName = resource.provision?.purpose?.[0]?.display;
                    const category = resource.category[0]?.text || resource.category[0]?.coding?.[0]?.display;

                    return (
                        <LinkToEdit
                            name={provisionName || purposeName || category}
                            resource={resource}
                            provenanceList={provenanceList}
                        />
                    );
                },
                width: 200,
            },
            {
                title: t`Date`,
                key: 'date',
                render: (r: Consent) => {
                    const createdAt = extractExtension(r.meta?.extension, 'ex:createdAt');

                    return createdAt ? formatHumanDate(r.dateTime || createdAt) : null;
                },
                width: 100,
            },
            {
                title: t`Practitioner`,
                key: 'actor',
                render: (r: Consent) => r.provision?.actor?.[0]?.reference.display,
                width: 200,
            },
        ],
    };
}

export function prepareActivitySummary(activitySummary: Observation[]): OverviewCard<Observation[]> {
    return {
        title: t`Activities`,
        key: 'activities',
        icon: <ThunderboltOutlined />,
        data: [activitySummary],
        getKey: () => 'activity-summary-timeline',
        columns: Object.keys(Array(7).fill(undefined))
            .reverse()
            .map((daysBefore) => moment().subtract(daysBefore, 'days'))
            .map((calendarDate) => ({
                title: calendarDate.format('ddd'),
                key: 'date',
                render: (r: Observation[]) => {
                    return (
                        <PatientActivitySummary
                            activitySummary={r.find(
                                (observation) => observation.effectiveDateTime === formatFHIRDate(calendarDate),
                            )}
                        />
                    );
                },
                width: 75,
                height: 75,
            })),
    };
}

export function prepareImmunizations(
    observations: Immunization[],
    provenanceList: Provenance[],
    total?: number,
): OverviewCard<Immunization> {
    return {
        title: t`Immunization`,
        key: 'immunization',
        icon: <HeartOutlined />,
        data: observations,
        total,
        getKey: (r: Immunization) => r.id!,
        columns: [
            {
                title: t`Name`,
                key: 'name',
                render: (resource: Immunization) => (
                    <LinkToEdit
                        name={resource.vaccineCode.coding?.[0]?.display}
                        resource={resource}
                        provenanceList={provenanceList}
                    />
                ),
            },
            {
                title: t`Date`,
                key: 'date',
                render: (r: Immunization) => (r.occurrenceDateTime ? formatHumanDate(r.occurrenceDateTime) : ''),
                width: 120,
            },
        ],
    };
}

export function prepareMedications(
    observations: MedicationStatement[],
    provenanceList: Provenance[],
    total?: number,
): OverviewCard<MedicationStatement> {
    return {
        title: t`Active Medications`,
        key: 'active-medications',
        icon: <img src={medicationIcon} />,
        data: observations,
        total,
        getKey: (r: MedicationStatement) => r.id!,
        columns: [
            {
                title: t`Name`,
                key: 'name',
                render: (resource: MedicationStatement) => (
                    <LinkToEdit
                        name={resource.medicationCodeableConcept?.coding?.[0]?.display}
                        resource={resource}
                        provenanceList={provenanceList}
                    />
                ),
            },
            {
                title: t`Dosage`,
                key: 'date',
                render: (r: MedicationStatement) => (r.dosage?.[0]?.text ? r.dosage?.[0]?.text : ''),
                width: 200,
            },
        ],
    };
}

export function prepareAppointments(bundle: Bundle<WithId<Appointment | Encounter>>) {
    const appointments = extractBundleResources(bundle).Appointment;
    const appointmentsWithEncounter = extractBundleResources(bundle).Encounter.map((e) => e.appointment?.[0]?.id);

    return appointments.filter((a) => !appointmentsWithEncounter.includes(a.id));
}

export function prepareAppointmentDetails(appointment: Appointment) {
    const [name, specialty] =
        appointment.participant
            .find((p) => fromFHIRReference(p.actor)?.resourceType === 'PractitionerRole')
            ?.actor?.display?.split(' - ') || [];
    const appointmentDetails = [
        {
            title: t`Practitioner`,
            value: name || '-',
        },
        {
            title: t`Service`,
            value: specialty || '-',
        },
        {
            title: t`Date`,
            value: appointment.start ? formatHumanDate(appointment.start) : '-',
        },
        {
            title: t`Time`,
            value: _.compact([
                appointment.start ? parseFHIRDateTime(appointment.start).format('HH:mm') : undefined,
                appointment.end ? parseFHIRDateTime(appointment.end).format('HH:mm') : undefined,
            ]).join('–'),
        },
    ];

    return appointmentDetails;
}

export function prepareServiceRequest(
    serviceRequests: ServiceRequest[],
    _provenanceList: Provenance[],
    total: number,
): OverviewCard<ServiceRequest> {
    return {
        title: t`Orders`,
        key: 'service-request',
        icon: <HeartOutlined />,
        data: serviceRequests,
        total,
        getKey: (r: ServiceRequest) => r.id!,
        columns: [
            {
                title: t`Name`,
                key: 'name',
                render: (resource: ServiceRequest) => resource.code?.text ?? resource.code?.coding?.[0]?.display,
            },
            {
                title: t`Intent`,
                key: 'intent',
                render: (r: ServiceRequest) => r.intent,
                width: 120,
            },
        ],
    };
}
