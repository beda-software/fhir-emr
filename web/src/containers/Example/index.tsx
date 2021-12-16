import { questionnaireIdLoader } from 'shared/src/hooks/questionnaire-response-form-data';

import { BaseLayout } from 'src/components/BaseLayout';
import { QuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';

export function Example() {
    return (
        <BaseLayout>
            <QuestionnaireResponseForm questionnaireLoader={questionnaireIdLoader('test')} />
        </BaseLayout>
    );
}
