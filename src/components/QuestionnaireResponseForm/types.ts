import { ItemControlGroupItemComponentMapping, ItemControlQuestionItemComponentMapping } from 'sdc-qrf';

import { FormFooterComponentProps } from 'src/components/BaseQuestionnaireResponseForm/FormFooter';
import {
    QuestionnaireResponseFormProps,
    QuestionnaireResponseFormSaveResponse,
} from 'src/hooks/questionnaire-response-form-data';

export interface QRFProps extends QuestionnaireResponseFormProps {
    onSuccess?: (response: QuestionnaireResponseFormSaveResponse) => void;
    onFailure?: (error: any) => void;
    readOnly?: boolean;
    itemControlQuestionItemComponents?: ItemControlQuestionItemComponentMapping;
    itemControlGroupItemComponents?: ItemControlGroupItemComponentMapping;
    onCancel?: () => void;

    FormFooterComponent?: React.ElementType<FormFooterComponentProps>;
    saveButtonTitle?: React.ReactNode;
    cancelButtonTitle?: React.ReactNode;
}
