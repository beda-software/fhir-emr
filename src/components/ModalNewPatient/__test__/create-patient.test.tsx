import { act, renderHook } from '@testing-library/react';
import { Patient, Questionnaire } from 'fhir/r4b';
import { QuestionnaireResponseFormData } from 'sdc-qrf';

import { ensure } from '@beda.software/fhir-react';

import { useQuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';
import { questionnaireIdLoader } from 'src/hooks/questionnaire-response-form-data';
import { getFHIRResource, getFHIRResources } from 'src/services/fhir';
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
        const defaultPatientsNumber = patientsBundle.total ?? 0;

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
        expect(patientsBundle.total).toBe(defaultPatientsNumber + 1);
        const currentPatientIndex = defaultPatientsNumber;

        const patient = patientsBundle!.entry![currentPatientIndex]!.resource!;

        expect(patient.id).toBeDefined();
        expect(patient.name![0]!.family).toBe('Doe');
        expect(patient.name![0]!.given![0]).toBe('John');
        expect(patient.gender).toBe('male');
        expect(patient.birthDate).toBe('2000-02-01');
        expect(patient.identifier![0]!.value).toBe('123123123');
        expect(patient.telecom![0]!.value).toBe('11231231231');
    });
});
