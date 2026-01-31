import { QuestionnaireResponse } from 'fhir/r4b';
import { ItemControlGroupItemComponentMapping, ItemControlQuestionItemComponentMapping } from 'sdc-qrf';

import { RemoteDataResult } from '@beda.software/remote-data';

import { FormFooterComponentProps } from 'src/components/BaseQuestionnaireResponseForm/FormFooter';
import {
    QuestionnaireResponseFormProps,
    QuestionnaireResponseFormSaveResponse,
} from 'src/hooks/questionnaire-response-form-data';
import { CustomYupTestsMap } from 'src/utils/questionnaire';

export interface QRFProps extends QuestionnaireResponseFormProps {
    onSuccess?: (response: QuestionnaireResponseFormSaveResponse) => void;
    onFailure?: (error: any) => void;
    readOnly?: boolean;
    itemControlQuestionItemComponents?: ItemControlQuestionItemComponentMapping;
    itemControlGroupItemComponents?: ItemControlGroupItemComponentMapping;
    onCancel?: () => void;
    onQRFUpdate?: (questionnaireResponse: QuestionnaireResponse) => void;
    onSaveDraft?: (questionnaireResponse: QuestionnaireResponse) => Promise<RemoteDataResult<QuestionnaireResponse>>;

    FormFooterComponent?: React.ElementType<FormFooterComponentProps>;
    saveButtonTitle?: React.ReactNode;
    cancelButtonTitle?: React.ReactNode;
    customYupTests?: CustomYupTestsMap;
}
