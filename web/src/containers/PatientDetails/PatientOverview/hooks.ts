import _ from 'lodash';
import moment from 'moment';

import { useService } from 'aidbox-react/lib/hooks/service';
import { isSuccess } from 'aidbox-react/lib/libs/remoteData';
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
    Condition,
    Encounter,
    Immunization,
    MedicationStatement,
    Observation,
    Patient,
    Provenance,
} from 'shared/src/contrib/aidbox';

import { formatHumanDate, getPersonAge } from 'src/utils/date';

import {
    prepareAllergies,
    prepareAppointments,
    prepareImmunizations,
    prepareMedications,
    prepareConditions,
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
            _subject: patient.id,
            _sort: '-_lastUpdated',
            code: bmiCode,
        });
        return mapSuccess(response, (bundle) => {
            return extractBundleResources(bundle).Observation;
        });
    }, []);

    const bmi = isSuccess(bmiRD) ? bmiRD.data[0]?.value?.Quantity?.value : undefined;

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
                    allergiesBundle: getFHIRResources<AllergyIntolerance | Provenance>(
                        'AllergyIntolerance',
                        {
                            patient: patient.id,
                            _sort: ['-lastUpdated'],
                            _revinclude: ['Provenance:target'],
                        },
                    ),
                    conditionsBundle: getFHIRResources<Condition | Provenance>('Condition', {
                        patient: patient.id,
                        _sort: ['-lastUpdated'],
                        _revinclude: ['Provenance:target'],
                    }),
                    immunizationsBundle: getFHIRResources<Immunization | Provenance>('Immunization', {
                        patient: patient.id,
                        _sort: ['-lastUpdated'],
                        _revinclude: ['Provenance:target'],
                    }),
                    medicationsBundle: getFHIRResources<MedicationStatement | Provenance>(
                        'MedicationStatement',
                        {
                            patient: patient.id,
                            _sort: ['-lastUpdated'],
                            _revinclude: ['Provenance:target'],
                        },
                    ),
                }),
                ({
                    allergiesBundle,
                    conditionsBundle,
                    immunizationsBundle,
                    medicationsBundle,
                    appointmentsBundle,
                }) => {
                    const allergies = extractBundleResources(allergiesBundle).AllergyIntolerance;
                    const allergiesProvenance = extractBundleResources(allergiesBundle).Provenance;
                    const conditions = extractBundleResources(conditionsBundle).Condition;
                    const conditionsProvenance = extractBundleResources(conditionsBundle).Provenance;
                    const immunizations = extractBundleResources(immunizationsBundle).Immunization;
                    const immunizationsProvenance = extractBundleResources(immunizationsBundle).Provenance;
                    const medications =
                        extractBundleResources(medicationsBundle).MedicationStatement;
                    const medicationsProvenance =
                        extractBundleResources(medicationsBundle).Provenance;
                    const cards = [
                        prepareConditions(conditions, conditionsProvenance),
                        prepareMedications(medications, medicationsProvenance),
                        prepareAllergies(allergies, allergiesProvenance),
                        prepareImmunizations(immunizations, immunizationsProvenance),
                    ];
                    const appointments = prepareAppointments(appointmentsBundle);

                    return { appointments, cards: _.sortBy(cards, ({ data }) => -1 * data.length) };
                },
            ),
        [],
    );

    return { response, patientDetails };
}
