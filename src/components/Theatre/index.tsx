import { useState } from 'react';

import { questionnaireIdLoader } from 'shared/src/hooks/questionnaire-response-form-data';

import { QuestionnaireResponseForm } from '../QuestionnaireResponseForm';

export function Theatre() {
    const [key, setKey] = useState(0);
    return (
        <div>
            <h1>Theter booking demo</h1>
            <br />
            <QuestionnaireResponseForm
                key={key}
                questionnaireLoader={questionnaireIdLoader('theatre')}
                onSuccess={() => setKey((k) => k + 1)}
            />
        </div>
    );
}
