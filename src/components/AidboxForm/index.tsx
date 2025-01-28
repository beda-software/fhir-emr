import { Questionnaire, QuestionnaireResponse } from 'fhir/r4b';
import { useEffect, useRef } from 'react';

interface AidboxFormProps {
    questionnaire: Questionnaire;
    questionnaireResponse?: QuestionnaireResponse;
}

export function AidboxForm({ questionnaire, questionnaireResponse }: AidboxFormProps) {
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
        }
    }, []);
    return (
        //@ts-ignore
        <aidbox-form-renderer
            ref={form}
            style={{ width: '100%', border: 'none', alignSelf: 'stretch', display: 'flex', height: '1000px' }}
            questionnaire={JSON.stringify(questionnaire)}
            questionnaire-response={JSON.stringify(questionnaireResponse)}
        />
    );
}
