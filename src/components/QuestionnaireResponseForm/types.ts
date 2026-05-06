import { QuestionnaireResponse } from 'fhir/r4b';
import { ItemControlGroupItemComponentMapping, ItemControlQuestionItemComponentMapping } from 'sdc-qrf';

import { Props } from '@beda.software/fhir-questionnaire/components';
import { RemoteDataResult } from '@beda.software/remote-data';

import { FormFooterComponentProps } from 'src/components/BaseQuestionnaireResponseForm/FormFooter';
import {
    QuestionnaireResponseFormProps as FhirQuestionnaireResponseFormProps,
    QuestionnaireResponseFormSaveResponse,
} from 'src/hooks/questionnaire-response-form-data';
import { CustomYupTestsMap } from 'src/utils/questionnaire';

export interface QRFProps extends Omit<FhirQuestionnaireResponseFormProps, 'serviceProvider'> {
    serviceProvider?: FhirQuestionnaireResponseFormProps['serviceProvider'];
    onSuccess?: (response: QuestionnaireResponseFormSaveResponse) => void;
    onFailure?: (error: any) => void;
    readOnly?: boolean;
    itemControlQuestionItemComponents?: ItemControlQuestionItemComponentMapping;
    itemControlGroupItemComponents?: ItemControlGroupItemComponentMapping;
    onCancel?: () => void;
    onSaveDraft?: (questionnaireResponse: QuestionnaireResponse) => Promise<RemoteDataResult<QuestionnaireResponse>>;

    FormFooterComponent?: React.ElementType<FormFooterComponentProps>;
    saveButtonTitle?: React.ReactElement | string;
    cancelButtonTitle?: React.ReactElement | string;
    customYupTests?: CustomYupTestsMap;
}

export type QuestionnaireResponseFormProps = QRFProps & {
    onEdit?: Props['onEdit'];
    FormWrapper?: Props['FormWrapper'];
    sdcServiceProvider?: Props['sdcServiceProvider'];
    groupItemComponent?: Props['groupItemComponent'];
    questionItemComponents?: Props['questionItemComponents'];
    itemControlQuestionItemComponents?: Props['itemControlQuestionItemComponents'];
    itemControlGroupItemComponents?: Props['itemControlGroupItemComponents'];
};
