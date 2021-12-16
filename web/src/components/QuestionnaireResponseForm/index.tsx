import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';

import {
    useQuestionnaireResponseFormData,
    QuestionnaireResponseFormProps,
} from 'shared/src/hooks/questionnaire-response-form-data';

import { BaseQuestionnaireResponseForm } from 'src/components/BaseQuestionnaireResponseForm';

export function QuestionnaireResponseForm(props: QuestionnaireResponseFormProps) {
    const { response, handleSave } = useQuestionnaireResponseFormData(props);

    return (
        <RenderRemoteData remoteData={response}>
            {(formData) => (
                <BaseQuestionnaireResponseForm formData={formData} onSubmit={handleSave} />
            )}
        </RenderRemoteData>
    );
}
