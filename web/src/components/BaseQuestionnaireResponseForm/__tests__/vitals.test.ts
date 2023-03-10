import { act, renderHook } from '@testing-library/react';
import moment from 'moment';

import { getFHIRResource, getFHIRResources, getReference } from 'aidbox-react/lib/services/fhir';
import { ensure } from 'aidbox-react/lib/utils/tests';

import { Observation, Questionnaire } from 'shared/src/contrib/aidbox';
import {
    questionnaireIdLoader,
    QuestionnaireResponseFormData,
} from 'shared/src/hooks/questionnaire-response-form-data';
import { renderHumanName } from 'shared/src/utils/fhir';

import { useQuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';
import {
    createEncounter,
    createPatient,
    createPractitionerRole,
    loginAdminUser,
} from 'src/setupTests';

const PATIENT_ADDITION_DATA = {
    name: [
        {
            given: ['Doe'],
            family: 'John',
        },
    ],
    birthDate: '2000-01-01',
};

const PRACTITIONER_ADDITION_DATA = {
    name: [{ family: 'Victorov', given: ['Victor', 'Victorovich'] }],
};

describe('Vitals', () => {
    beforeAll(async () => {
        await loginAdminUser();
    });

    test('Creation', async () => {
        const patient = await createPatient(PATIENT_ADDITION_DATA);
        const patientName = renderHumanName(patient.name![0]);

        const { practitionerRole } = await createPractitionerRole(PRACTITIONER_ADDITION_DATA);

        const encounter = await createEncounter(
            getReference(patient),
            getReference(practitionerRole),
            moment('2020-01-01'),
        );

        const createVitalsQR = ensure(
            await getFHIRResource<Questionnaire>({
                resourceType: 'Questionnaire',
                id: 'vitals',
            }),
        );

        const formData: QuestionnaireResponseFormData = {
            context: {
                questionnaire: createVitalsQR,
                questionnaireResponse: {
                    resourceType: 'QuestionnaireResponse',
                    questionnaire: undefined,
                    status: 'in-progress',
                },
                launchContextParameters: [
                    {
                        name: 'Patient',
                        resource: patient,
                    },
                ],
            },
            formValues: {
                patientId: [
                    {
                        question: 'PatientId',
                        value: {
                            string: patient.id,
                        },
                        items: {},
                    },
                ],
                patientName: [
                    {
                        question: 'PatientName',
                        value: {
                            string: patientName,
                        },
                        items: {},
                    },
                ],
                encounterId: [
                    {
                        value: {
                            string: encounter.id,
                        },
                    },
                ],
                'blood-pressure': {
                    question: 'Blood Pressure',
                    items: {
                        'blood-pressure-systolic-diastolic': {
                            items: {
                                'blood-pressure-systolic': [
                                    {
                                        question: 'BP systolic',
                                        value: {
                                            integer: 100,
                                        },
                                        items: {},
                                    },
                                ],
                                'blood-pressure-diastolic': [
                                    {
                                        question: 'BP diastolic',
                                        value: {
                                            integer: 100,
                                        },
                                        items: {},
                                    },
                                ],
                            },
                        },
                        'blood-pressure-positions': [
                            {
                                question: 'Positions',
                                value: {
                                    Coding: {
                                        code: 'sitting',
                                        display: 'Sitting',
                                    },
                                },
                                items: {},
                            },
                        ],
                        'blood-pressure-arm': [
                            {
                                question: 'Arm',
                                value: {
                                    Coding: {
                                        code: 'biceps-left',
                                        display: 'Biceps left',
                                    },
                                },
                                items: {},
                            },
                        ],
                    },
                },
                height: [
                    {
                        value: {
                            integer: 3,
                        },
                    },
                ],
                weight: [
                    {
                        value: {
                            integer: 4,
                        },
                    },
                ],
                temperature: [
                    {
                        value: {
                            integer: 5,
                        },
                    },
                ],
                'oxygen-saturation': [
                    {
                        value: {
                            integer: 6,
                        },
                    },
                ],
                'pulse-rate': [
                    {
                        value: {
                            integer: 7,
                        },
                    },
                ],
                'respiratory-rate': [
                    {
                        value: {
                            integer: 8,
                        },
                    },
                ],
            },
        };

        const { result } = renderHook(() =>
            useQuestionnaireResponseForm({
                questionnaireLoader: questionnaireIdLoader('vitals-create'),
                launchContextParameters: [
                    { name: 'Patient', resource: patient },
                    { name: 'Encounter', resource: encounter },
                ],
            }),
        );

        let observationsBundle = ensure(await getFHIRResources<Observation>('Observation', {}));
        expect(observationsBundle.total).toBe(0);

        await act(async () => {
            await result.current.onSubmit(formData);
        });

        observationsBundle = ensure(await getFHIRResources<Observation>('Observation', {}));
        expect(observationsBundle.total).toBe(7);

        const temperatureObservation = observationsBundle.entry!.find((observation) => {
            return observation.resource!.code.coding![0]!.code === '8310-5';
        })?.resource!;
        expect(temperatureObservation.value?.Quantity?.value).toBe(
            formData.formValues.temperature![0].value.integer,
        );

        const bloodPressureObservation = observationsBundle.entry!.find((observation) => {
            return observation.resource!.code.coding![0]!.code === '85354-9';
        })?.resource!;
        expect(bloodPressureObservation.bodySite?.coding![0]?.code).toBe(
            formData.formValues['blood-pressure']!['items']['blood-pressure-arm'][0].value.Coding
                .code,
        );
        expect(bloodPressureObservation.bodySite?.coding![1]?.code).toBe(
            formData.formValues['blood-pressure']!['items']['blood-pressure-positions'][0].value
                .Coding.code,
        );
        expect(bloodPressureObservation.component![0]?.value?.Quantity?.value).toBe(
            formData.formValues['blood-pressure']!['items']['blood-pressure-systolic-diastolic'].items[
                'blood-pressure-systolic'
            ][0].value.integer,
        );
        expect(bloodPressureObservation.component![1]?.value?.Quantity?.value).toBe(
            formData.formValues['blood-pressure']!['items']['blood-pressure-systolic-diastolic'].items[
                'blood-pressure-diastolic'
            ][0].value.integer,
        );

        const pulseRateObservation = observationsBundle.entry!.find((observation) => {
            return observation.resource!.code.coding![0]!.code === '8867-4';
        })?.resource!;
        expect(pulseRateObservation.value?.Quantity?.value).toBe(
            formData.formValues['pulse-rate']![0].value.integer,
        );

        const respiratoryRateObservation = observationsBundle.entry!.find((observation) => {
            return observation.resource!.code.coding![0]!.code === '9279-1';
        })?.resource!;
        expect(respiratoryRateObservation.value?.Quantity?.value).toBe(
            formData.formValues['respiratory-rate']![0].value.integer,
        );

        const oxygenSaturationObservation = observationsBundle.entry!.find((observation) => {
            return observation.resource!.code.coding![0]!.code === '59408-5';
        })?.resource!;
        expect(oxygenSaturationObservation.value?.Quantity?.value).toBe(
            formData.formValues['oxygen-saturation']![0].value.integer,
        );

        const heightObservation = observationsBundle.entry!.find((observation) => {
            return observation.resource!.code.coding![0]!.code === '8302-2';
        })?.resource!;
        expect(heightObservation.value?.Quantity?.value).toBe(
            formData.formValues.height![0].value.integer,
        );

        const weightObservation = observationsBundle.entry!.find((observation) => {
            return observation.resource!.code.coding![0]!.code === '29463-7';
        })?.resource!;
        expect(weightObservation.value?.Quantity?.value).toBe(
            formData.formValues.weight![0].value.integer,
        );
    });
});
