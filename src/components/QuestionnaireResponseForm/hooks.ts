import _ from 'lodash';
import { useMemo } from 'react';

import { QRFProps } from 'src/components/QuestionnaireResponseForm/types';
import { onFormResponse } from 'src/components/QuestionnaireResponseForm/utils';
import {
    QuestionnaireResponseFormData,
    useQuestionnaireResponseFormData,
} from 'src/hooks/questionnaire-response-form-data';

export function useQuestionnaireResponseForm(props: QRFProps) {
    // TODO find what cause rerender and fix it
    // remove this temporary hack
    const memoizedProps = useMemo(() => props, [JSON.stringify(props)]);

    const { response, handleSave } = useQuestionnaireResponseFormData(memoizedProps);
    const { onSuccess, onFailure, readOnly, initialQuestionnaireResponse, onCancel } = memoizedProps;

    const onSubmit = async (formData: QuestionnaireResponseFormData) => {
        const modifiedFormData = _.merge({}, formData, {
            context: {
                questionnaireResponse: {
                    questionnaire: initialQuestionnaireResponse?.questionnaire,
                },
            },
        });

        /* delete modifiedFormData.context.questionnaireResponse.meta; */

        const saveResponse = await handleSave(modifiedFormData);
        onFormResponse({ response: saveResponse, onSuccess, onFailure });
    };

    return { response, onSubmit, readOnly, onCancel };
}
