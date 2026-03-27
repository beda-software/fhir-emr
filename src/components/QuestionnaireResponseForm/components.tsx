import {
    // useQuestionnaireResponseForm,
    Props,
} from '@beda.software/fhir-questionnaire/components/QuestionnaireResponseForm';
import { BaseQuestionnaireResponseForm } from '@beda.software/fhir-questionnaire/components/QuestionnaireResponseForm/BaseQuestionnaireResponseForm';
import { RenderRemoteData } from '@beda.software/fhir-react';

// import { FormWrapper, GroupItemComponent } from 'src/components/FormWrapper';
import { useQuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';
import { service } from 'src/services';

import { Spinner } from '../Spinner';

export function QuestionnaireResponseForm(props: Props) {
    const { response, onSubmit, readOnly } = useQuestionnaireResponseForm(props);

    return (
        <RenderRemoteData remoteData={response} renderLoading={Spinner}>
            {(formData) => (
                <BaseQuestionnaireResponseForm
                    formData={formData}
                    onSubmit={onSubmit}
                    readOnly={readOnly}
                    fhirService={service}
                    // groupItemComponent={GroupItemComponent}
                    // FormWrapper={(props) => <FormWrapper {...props} formData={formData} />}
                    {...props}
                />
            )}
        </RenderRemoteData>
    );
}
