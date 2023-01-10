import { notification } from 'antd';
import { CustomWidgetsMapping } from 'sdc-qrf';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';
import { isSuccess } from 'aidbox-react/lib/libs/remoteData';
import { formatError } from 'aidbox-react/lib/utils/error';

import {
    QuestionnaireResponseFormData,
    QuestionnaireResponseFormProps,
    useQuestionnaireResponseFormData,
} from 'shared/src/hooks/questionnaire-response-form-data';

import { BaseQuestionnaireResponseForm } from 'src/components/BaseQuestionnaireResponseForm';

interface Props extends QuestionnaireResponseFormProps {
    onSuccess?: (resource: any) => void;
    onFailure?: (error: any) => void;
    readOnly?: boolean;
    customWidgets?: CustomWidgetsMapping;
}

export function useQuestionnaireResponseForm(props: Props) {
    const { response, handleSave } = useQuestionnaireResponseFormData(props);
    const { onSuccess, onFailure, readOnly, customWidgets } = props;

    const onSubmit = async (formData: QuestionnaireResponseFormData) => {
        const saveResponse = await handleSave(formData);

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

    return { response, onSubmit, readOnly, customWidgets };
}

export function QuestionnaireResponseForm(props: Props) {
    const { response, onSubmit, readOnly, customWidgets } = useQuestionnaireResponseForm(props);

    return (
        <RenderRemoteData remoteData={response}>
            {(formData) => (
                <BaseQuestionnaireResponseForm
                    formData={formData}
                    onSubmit={onSubmit}
                    readOnly={readOnly}
                    customWidgets={customWidgets}
                />
            )}
        </RenderRemoteData>
    );
}
