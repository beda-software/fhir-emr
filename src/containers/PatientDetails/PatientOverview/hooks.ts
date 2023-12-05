import {
    AllergyIntolerance,
    Appointment,
    Encounter,
    Immunization,
    MedicationStatement,
    Observation,
    Patient,
    Provenance,
    Condition,
    Consent,
} from 'fhir/r4b';
import { formatFHIRDate } from 'fhir-react';
import _ from 'lodash';
import moment from 'moment';

import { useService } from 'fhir-react/lib/hooks/service';
import { isSuccess } from 'fhir-react/lib/libs/remoteData';
import { extractBundleResources, getAllFHIRResources, getFHIRResources } from 'fhir-react/lib/services/fhir';
import { mapSuccess, resolveMap } from 'fhir-react/lib/services/service';
import { formatFHIRDateTime } from 'fhir-react/lib/utils/date';

import { formatHumanDate, getPersonAge } from 'src/utils/date';

import {
    prepareAllergies,
    prepareAppointments,
    prepareImmunizations,
    prepareMedications,
    prepareConditions,
    prepareConsents,
    prepareActivitySummary,
} from './utils';

interface Props {
    patient: Patient;
    reload: () => void;
}

const bmiCode = '39156-5';

export function usePatientOverview(props: Props) {
    const { patient } = props;

    const [bmiRD] = useService(async () => {
        const response = await getFHIRResources<Observation>('Observation', {
            subject: patient.id,
            code: bmiCode,
            _sort: ['-_lastUpdated'],
            _count: 1,
        });
        return mapSuccess(response, (bundle) => {
            return extractBundleResources(bundle).Observation;
        });
    }, []);

    const bmi = isSuccess(bmiRD) ? bmiRD.data[0]?.valueQuantity?.value : undefined;

    const patientDetails = [
        {
            title: 'Birth date',
            value: patient.birthDate
                ? `${formatHumanDate(patient.birthDate)} • ${getPersonAge(patient.birthDate)}`
                : undefined,
        },
        {
            title: 'Sex',
            value: _.upperFirst(patient.gender),
        },
        {
            title: 'BMI',
            value: bmi,
        },
        {
            title: 'Phone number',
            value: patient.telecom?.filter(({ system }) => system === 'phone')[0]?.value,
        },
        {
            title: 'SSN',
            value: patient.identifier?.find(({ system }) => system === '1.2.643.100.3')?.value,
        },
    ];

    const [response] = useService(
        async () =>
            mapSuccess(
                await resolveMap({
                    appointmentsBundle: getAllFHIRResources<Appointment | Encounter>('Appointment', {
                        actor: patient.id,
                        date: [`ge${formatFHIRDateTime(moment().startOf('day'))}`],
                        _revinclude: ['Encounter:appointment'],
                        'status:not': ['entered-in-error,cancelled,checked-in'],
                    }),
                    allergiesBundle: getFHIRResources<AllergyIntolerance | Provenance>('AllergyIntolerance', {
                        patient: patient.id,
                        _sort: ['-_date'],
                        _revinclude: ['Provenance:target'],
                        _count: 7,
                    }),
                    conditionsBundle: getFHIRResources<Condition | Provenance>('Condition', {
                        patient: patient.id,
                        _sort: ['-_recorded-date'],
                        _revinclude: ['Provenance:target'],
                        _count: 7,
                    }),
                    immunizationsBundle: getFHIRResources<Immunization | Provenance>('Immunization', {
                        patient: patient.id,
                        _sort: ['-_date'],
                        _revinclude: ['Provenance:target'],
                        _count: 7,
                    }),
                    medicationsBundle: getFHIRResources<MedicationStatement | Provenance>('MedicationStatement', {
                        patient: patient.id,
                        _sort: ['-_lastUpdated'],
                        _revinclude: ['Provenance:target'],
                        _count: 7,
                    }),
                    consentsBundle: getFHIRResources<Consent | Provenance>('Consent', {
                        patient: patient.id,
                        status: 'active',
                        _sort: ['-_lastUpdated'],
                        _revinclude: ['Provenance:target'],
                        _count: 7,
                    }),
                    activitySummaryBundle: getFHIRResources<Observation>('Observation', {
                        patient: patient.id,
                        status: 'final',
                        code: 'activity-summary',
                        date: `ge${formatFHIRDate(moment().subtract(6, 'days'))}`,
                    }),
                }),
                ({
                    allergiesBundle,
                    conditionsBundle,
                    immunizationsBundle,
                    medicationsBundle,
                    appointmentsBundle,
                    consentsBundle,
                    activitySummaryBundle,
                }) => {
                    const allergies = extractBundleResources(allergiesBundle).AllergyIntolerance;
                    const allergiesProvenance = extractBundleResources(allergiesBundle).Provenance;
                    const conditions = extractBundleResources(conditionsBundle).Condition;
                    const conditionsProvenance = extractBundleResources(conditionsBundle).Provenance;
                    const consents = extractBundleResources(consentsBundle).Consent;
                    const consentsProvenance = extractBundleResources(consentsBundle).Provenance;
                    const immunizations = extractBundleResources(immunizationsBundle).Immunization;
                    const immunizationsProvenance = extractBundleResources(immunizationsBundle).Provenance;
                    const medications = extractBundleResources(medicationsBundle).MedicationStatement;
                    const medicationsProvenance = extractBundleResources(medicationsBundle).Provenance;
                    const activitySummary = extractBundleResources(activitySummaryBundle).Observation;
                    const cards = [
                        prepareConditions(conditions, conditionsProvenance, conditionsBundle.total),
                        prepareMedications(medications, medicationsProvenance, medicationsBundle.total),
                        prepareAllergies(allergies, allergiesProvenance, allergiesBundle.total),
                        prepareImmunizations(immunizations, immunizationsProvenance, immunizationsBundle.total),
                        prepareConsents(consents, consentsProvenance, consentsBundle.total),
                        prepareActivitySummary(activitySummary),
                    ];
                    const appointments = prepareAppointments(appointmentsBundle);

                    return { appointments, cards: _.sortBy(cards, ({ data }) => -1 * data.length) };
                },
            ),
        [],
    );

    return { response, patientDetails };
}
