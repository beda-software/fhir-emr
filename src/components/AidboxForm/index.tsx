import { ParametersParameter, Questionnaire, QuestionnaireResponse } from 'fhir/r4b';
import { useEffect, useRef } from 'react';
import { QuestionnaireResponseFormData } from 'sdc-qrf';

import config from '@beda.software/emr-config';

import { getToken } from 'src/services';

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
            form.current.fetch = async (url: string, init: any) => {
                if (init.tag === 'get-response' && url.includes('local-questionnaire-id')) {
                    return new Response(JSON.stringify(questionnaireResponse), {
                        status: 200,
                    });
                }
                const response = await fetch(config.baseURL + url, init);
                if (response.status === 200 && init.tag === 'process-response') {
                    const resp = await response.clone().json();
                    const questionnaireResponse = resp.parameter.find(
                        (param: ParametersParameter) => param.name === 'response',
                    );
                    if (questionnaireResponse?.resource?.status == 'completed' && onSubmit) {
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
                }
                return response;
            };
        }
    }, []);

    return (
        //@ts-ignore
        <aidbox-form-renderer
            ref={form}
            style={{ width: '100%', border: 'none', alignSelf: 'stretch', display: 'flex', height: '1000px' }}
            base-url={config.baseURL}
            token={getToken()}
            questionnaire-id={questionnaire.id!}
            questionnaire-response-id="local-questionnaire-id"
            disable-load-sdc-config={true}
            enable-fetch-proxy={true}
        />
    );
}
