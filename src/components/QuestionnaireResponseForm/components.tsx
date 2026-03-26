import { RenderRemoteData } from '@beda.software/fhir-react';

import { FormWrapper, GroupItemComponent } from 'src/components/FormWrapper';
import { QRFProps, useQuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';
import { BaseQuestionnaireResponseForm } from 'src/packages/@beda.software/fhir-questionnaire/components/QuestionnaireResponseForm/BaseQuestionnaireResponseForm';
import { service } from 'src/services';

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
                    fhirService={service}
                    groupItemComponent={GroupItemComponent}
                    FormWrapper={(props) => <FormWrapper {...props} formData={formData} onCancel={onCancel} />}
                    {...props}
                />
            )}
        </RenderRemoteData>
    );
}
