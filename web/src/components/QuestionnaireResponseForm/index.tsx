import { notification } from 'antd';
import _ from 'lodash';
import {
    ItemControlGroupItemComponentMapping,
    ItemControlQuestionItemComponentMapping,
} from 'sdc-qrf';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';
import { isSuccess } from 'aidbox-react/lib/libs/remoteData';
import { formatError } from 'aidbox-react/lib/utils/error';

import {
    QuestionnaireResponseFormData,
    QuestionnaireResponseFormProps,
    useQuestionnaireResponseFormData,
} from 'shared/src/hooks/questionnaire-response-form-data';

import { BaseQuestionnaireResponseForm } from 'src/components/BaseQuestionnaireResponseForm';

import { Spinner } from '../Spinner';

interface Props extends QuestionnaireResponseFormProps {
    onSuccess?: (resource: any) => void;
    onFailure?: (error: any) => void;
    readOnly?: boolean;
    itemControlQuestionItemComponents?: ItemControlQuestionItemComponentMapping;
    itemControlGroupItemComponents?: ItemControlGroupItemComponentMapping;
    onCancel?: () => void;
}

export function useQuestionnaireResponseForm(props: Props) {
    const { response, handleSave } = useQuestionnaireResponseFormData(props);
    const { onSuccess, onFailure, readOnly, initialQuestionnaireResponse, onCancel } = props;

    const onSubmit = async (formData: QuestionnaireResponseFormData) => {
        console.log('formData!!!!!!!!!!!!!!!', formData);

        const saveResponse = await handleSave(
            _.merge({}, formData, {
                context: {
                    questionnaireResponse: {
                        questionnaire: initialQuestionnaireResponse?.questionnaire,
                    },
                },
            }),
        );

        if (isSuccess(saveResponse)) {
            if (saveResponse.data.extracted) {
                if (onSuccess) {
                    onSuccess(saveResponse.data);
                } else {
                    notification.success({
                        message: 'Form successfully saved',
                    });
                }
            } else {
                if (onFailure) {
                    onFailure('Error while extracting');
                } else {
                    notification.error({ message: 'Error while extracting' });
                }
            }
        } else {
            if (onFailure) {
                onFailure(saveResponse.error);
            } else {
                notification.error({ message: formatError(saveResponse.error) });
            }
        }
    };

    return { response, onSubmit, readOnly, onCancel };
}

export function QuestionnaireResponseForm(props: Props) {
    const { response, onSubmit, readOnly, onCancel } = useQuestionnaireResponseForm(props);

    return (
        <RenderRemoteData remoteData={response} renderLoading={Spinner}>
            {(formData) => (
                <BaseQuestionnaireResponseForm
                    formData={formData}
                    onSubmit={onSubmit}
                    readOnly={readOnly}
                    onCancel={onCancel}
                    {...props}
                />
            )}
        </RenderRemoteData>
    );
}
