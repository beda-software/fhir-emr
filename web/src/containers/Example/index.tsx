import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';

import {
    questionnaireIdLoader,
    useQuestionnaireResponseFormData,
} from 'shared/src/hooks/questionnaire-response-form-data';

import { BaseLayout } from 'src/components/BaseLayout';
import { QuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';

export function Example() {
    const { response, handleSave } = useQuestionnaireResponseFormData({
        questionnaireLoader: questionnaireIdLoader('test'),
    });

    return (
        <BaseLayout>
            <RenderRemoteData remoteData={response}>
                {(formData) => (
                    <QuestionnaireResponseForm formData={formData} onSubmit={handleSave} />
                )}
            </RenderRemoteData>
        </BaseLayout>
    );
}
