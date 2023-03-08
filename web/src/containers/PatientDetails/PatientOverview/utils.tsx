import { AlertOutlined, ExperimentOutlined, HeartOutlined } from '@ant-design/icons';
import { t } from '@lingui/macro';
import _ from 'lodash';
import moment from 'moment';

import { extractBundleResources, WithId } from 'aidbox-react/lib/services/fhir';

import {
    AllergyIntolerance,
    Appointment,
    Bundle,
    Encounter,
    Immunization,
    MedicationStatement,
    Observation,
} from 'shared/src/contrib/aidbox';
import { FHIRTime } from 'shared/src/utils/date';

import { formatHumanDate } from 'src/utils/date';

import medicationIcon from './images/medication.svg';

interface OverviewCard<T = any> {
    title: string;
    icon: React.ReactNode;
    data: T[];
    columns: {
        key: string;
        title: string;
        render: (r: T) => React.ReactNode;
        width?: string | number;
    }[];
    getKey: (r: T) => string;
}

export function prepareAllergies(
    allergies: AllergyIntolerance[],
): OverviewCard<AllergyIntolerance> {
    return {
        title: t`Allergies`,
        icon: <ExperimentOutlined />,
        data: allergies,
        getKey: (r: AllergyIntolerance) => r.id!,
        columns: [
            {
                title: t`Name`,
                key: 'name',
                render: (r: AllergyIntolerance) => r.code?.coding?.[0]?.display,
            },
            {
                title: t`Date`,
                key: 'date',
                render: (r: AllergyIntolerance) => formatHumanDate(r.meta?.createdAt!),
                width: 200,
            },
        ],
    };
}

export function prepareObservations(observations: Observation[]): OverviewCard<Observation> {
    return {
        title: t`Conditions`,
        icon: <AlertOutlined />,
        data: observations,
        getKey: (r: Observation) => r.id!,
        columns: [
            {
                title: t`Name`,
                key: 'name',
                render: (r: Observation) => r.interpretation?.[0]?.text,
            },
            {
                title: t`Date`,
                key: 'date',
                render: (r: Observation) => formatHumanDate(r.meta?.createdAt!),
                width: 200,
            },
        ],
    };
}

export function prepareImmunizations(observations: Immunization[]): OverviewCard<Immunization> {
    return {
        title: t`Immunization`,
        icon: <HeartOutlined />,
        data: observations,
        getKey: (r: Immunization) => r.id!,
        columns: [
            {
                title: t`Name`,
                key: 'name',
                render: (r: Immunization) => r.vaccineCode.coding?.[0]?.display,
            },
            {
                title: t`Date`,
                key: 'date',
                render: (r: Immunization) =>
                    r.occurrence?.dateTime ? formatHumanDate(r.occurrence?.dateTime) : '',
                width: 200,
            },
        ],
    };
}

export function prepareMedications(
    observations: MedicationStatement[],
): OverviewCard<MedicationStatement> {
    return {
        title: t`Active Medications`,
        // eslint-disable-next-line jsx-a11y/alt-text
        icon: <img src={medicationIcon} />,
        data: observations,
        getKey: (r: MedicationStatement) => r.id!,
        columns: [
            {
                title: t`Name`,
                key: 'name',
                render: (r: MedicationStatement) =>
                    r.medication?.CodeableConcept?.coding?.[0]?.display,
            },
            {
                title: t`Dosage`,
                key: 'date',
                render: (r: MedicationStatement) =>
                    r.dosage?.[0]?.text ? r.dosage?.[0]?.text : '',
                width: 200,
            },
        ],
    };
}

export function prepareAppointments(bundle: Bundle<WithId<Appointment | Encounter>>) {
    const appointments = extractBundleResources(bundle).Appointment;
    const appointmentsWithEncounter = extractBundleResources(bundle).Encounter.map(
        (e) => e.appointment?.[0]?.id,
    );

    return appointments.filter((a) => !appointmentsWithEncounter.includes(a.id));
}

export function prepareAppointmentDetails(appointment: Appointment) {
    const [name, specialty] =
        appointment.participant
            .find((p) => p.actor?.resourceType === 'PractitionerRole')
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
                appointment.start ? moment(appointment.start, FHIRTime).format('HH:mm') : undefined,
                appointment.end ? moment(appointment.end, FHIRTime).format('HH:mm') : undefined,
            ]).join('–'),
        },
    ];

    return appointmentDetails;
}
