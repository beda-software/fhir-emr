import { RenderRemoteData } from '@beda.software/fhir-react';

import { BaseQuestionnaireResponseForm } from 'src/components/BaseQuestionnaireResponseForm';
import { QRFProps, useQuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';

import { Spinner } from '../Spinner';

export function QuestionnaireResponseForm(props: QRFProps) {
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
