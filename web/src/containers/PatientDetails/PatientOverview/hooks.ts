import _ from 'lodash';
import moment from 'moment';

import { useService } from 'aidbox-react/lib/hooks/service';
import {
    extractBundleResources,
    getAllFHIRResources,
    getFHIRResources,
} from 'aidbox-react/lib/services/fhir';
import { mapSuccess, resolveMap } from 'aidbox-react/lib/services/service';
import { formatFHIRDateTime } from 'aidbox-react/lib/utils/date';

import {
    AllergyIntolerance,
    Appointment,
    Encounter,
    Immunization,
    MedicationStatement,
    Observation,
    Patient,
} from 'shared/src/contrib/aidbox';

import { formatHumanDate, getPersonAge } from 'src/utils/date';

import {
    prepareAllergies,
    prepareAppointments,
    prepareImmunizations,
    prepareMedications,
    prepareObservations,
} from './utils';

interface Props {
    patient: Patient;
    reload: () => void;
}

const depressionSeverityCode = '44261-6';
const anxietySeverityCode = '70274-6';

export function usePatientOverview(props: Props) {
    const { patient } = props;

    let patientDetails = [
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
        // TODO: calculate after Vitals added
        // {
        //     title: 'BMI',
        //     value: '26',
        // },
        {
            title: 'Phone number',
            value: patient.telecom?.filter(({ system }) => system === 'mobile')[0]!.value,
        },
        {
            title: 'SSN',
            value: undefined,
        },
    ];

    const [response] = useService(
        async () =>
            mapSuccess(
                await resolveMap({
                    appointmentsBundle: getAllFHIRResources<Appointment | Encounter>(
                        'Appointment',
                        {
                            actor: patient.id,
                            date: [`ge${formatFHIRDateTime(moment().startOf('day'))}`],
                            _revinclude: ['Encounter:appointment'],
                            'status:not': ['entered-in-error,cancelled'],
                        },
                    ),
                    allergiesBundle: getFHIRResources<AllergyIntolerance>('AllergyIntolerance', {
                        patient: patient.id,
                        _sort: ['-lastUpdated'],
                    }),
                    observationsBundle: getFHIRResources<Observation>('Observation', {
                        patient: patient.id,
                        _sort: ['-lastUpdated'],
                        code: [`${depressionSeverityCode},${anxietySeverityCode}`],
                    }),
                    immunizationsBundle: getFHIRResources<Immunization>('Immunization', {
                        patient: patient.id,
                        _sort: ['-lastUpdated'],
                    }),
                    medicationsBundle: getFHIRResources<MedicationStatement>(
                        'MedicationStatement',
                        {
                            patient: patient.id,
                            _sort: ['-lastUpdated'],
                        },
                    ),
                }),
                ({
                    allergiesBundle,
                    observationsBundle,
                    immunizationsBundle,
                    medicationsBundle,
                    appointmentsBundle,
                }) => {
                    const allergies = extractBundleResources(allergiesBundle).AllergyIntolerance;
                    const observations = extractBundleResources(observationsBundle).Observation;
                    const immunizations = extractBundleResources(immunizationsBundle).Immunization;
                    const medications =
                        extractBundleResources(medicationsBundle).MedicationStatement;
                    const cards = [
                        prepareObservations(observations),
                        prepareMedications(medications),
                        prepareAllergies(allergies),
                        prepareImmunizations(immunizations),
                    ];
                    const appointments = prepareAppointments(appointmentsBundle);

                    return { appointments, cards: _.sortBy(cards, ({ data }) => -1 * data.length) };
                },
            ),
        [],
    );

    return { response, patientDetails };
}
