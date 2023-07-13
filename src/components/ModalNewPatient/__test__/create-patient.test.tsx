import { act, renderHook } from '@testing-library/react';
import { Patient, Questionnaire } from 'fhir/r4b';

import { getFHIRResource, getFHIRResources } from 'fhir-react/lib/services/fhir';
import { ensure } from 'fhir-react/lib/utils/tests';

import {
    questionnaireIdLoader,
    QuestionnaireResponseFormData,
} from 'shared/src/hooks/questionnaire-response-form-data';

import { useQuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';
import { loginAdminUser } from 'src/setupTests';

describe('createPatient', () => {
    beforeAll(async () => {
        await loginAdminUser();
    });

    test('should create patient', async () => {
        const createPatientQR = ensure(
            await getFHIRResource<Questionnaire>({
                reference: `Questionnaire/patient-create`,
            }),
        );

        let patientsBundle = ensure(await getFHIRResources<Patient>('Patient', {}));
        expect(patientsBundle.total).toBe(0);

        const formData: QuestionnaireResponseFormData = {
            context: {
                questionnaire: createPatientQR,
                questionnaireResponse: {
                    resourceType: 'QuestionnaireResponse',
                    questionnaire: undefined,
                    status: 'in-progress',
                },
                launchContextParameters: [],
            },
            formValues: {
                'patient-id': [
                    {
                        value: {},
                    },
                ],
                'last-name': [
                    {
                        value: {
                            string: 'Doe',
                        },
                    },
                ],
                'first-name': [
                    {
                        value: {
                            string: 'John',
                        },
                    },
                ],
                'birth-date': [
                    {
                        value: {
                            date: '2000-02-01',
                        },
                    },
                ],
                gender: [
                    {
                        value: {
                            Coding: {
                                code: 'male',
                                display: 'Male',
                                system: 'http://hl7.org/fhir/administrative-gender',
                            },
                        },
                    },
                ],
                ssn: [
                    {
                        value: {
                            string: '123123123',
                        },
                    },
                ],
                mobile: [
                    {
                        value: {
                            string: '11231231231',
                        },
                    },
                ],
            },
        };

        const { result } = renderHook(() =>
            useQuestionnaireResponseForm({
                questionnaireLoader: questionnaireIdLoader('patient-create'),
                launchContextParameters: [],
            }),
        );

        await act(async () => {
            await result.current.onSubmit(formData);
        });

        patientsBundle = ensure(await getFHIRResources<Patient>('Patient', {}));
        expect(patientsBundle.total).toBe(1);

        const patient = patientsBundle!.entry![0]!.resource!;

        expect(patient.id).toBeDefined();
        expect(patient.name![0]!.family).toBe('Doe');
        expect(patient.name![0]!.given![0]).toBe('John');
        expect(patient.gender).toBe('male');
        expect(patient.birthDate).toBe('2000-02-01');
        expect(patient.identifier![0]!.value).toBe('123123123');
        expect(patient.telecom![0]!.value).toBe('11231231231');
    });
});
