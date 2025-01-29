import { Questionnaire, QuestionnaireResponse } from 'fhir/r4b';
import { useEffect, useRef } from 'react';
import { QuestionnaireResponseFormData } from 'sdc-qrf';

interface AidboxFormProps {
    questionnaire: Questionnaire;
    questionnaireResponse?: QuestionnaireResponse;
    onSubmit?: (formData: QuestionnaireResponseFormData) => Promise<any>;
}

export function AidboxForm({ questionnaire, questionnaireResponse, onSubmit }: AidboxFormProps) {
    const form = useRef();
    useEffect(() => {
        if (form && form.current) {
            //@ts-ignore
            form.current.addEventListener('change', (event) => {
                console.log(event);
            });
            //@ts-ignore
            form.current.addEventListener('submit', (event) => {
                console.log(event);
            });
            //@ts-ignore
            form.current.addEventListener('ready', (event) => {
                console.log(event);
            });
            //@ts-ignore
            form.current.addEventListener('extracted', (event) => {
                console.log(event);
                if (onSubmit) {
                    onSubmit({
                        formValues: {},
                        context: {
                            questionnaire,
                            questionnaireResponse:
                                questionnaireResponse ?? ({ resourceType: 'QuestionnaireResponse' } as any),
                            launchContextParameters: [],
                        },
                    });
                }
            });
        }
    }, []);
    return (
        //@ts-ignore
        <aidbox-form-renderer
            ref={form}
            style={{ width: '100%', border: 'none', alignSelf: 'stretch', display: 'flex', height: '1000px' }}
            questionnaire-id={questionnaire.id!}
            questionnaire-response={JSON.stringify(questionnaireResponse)}
        />
    );
}
