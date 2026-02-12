import _ from 'lodash';
import { FCEQuestionnaireItem, FormItems, getAnswerValues, isAnswerValueEmpty } from 'sdc-qrf';

import { getValueFromAnswerValue, isFormAnswerItems } from '../utils';

export const RenderFormItemReadOnly = (props: {
    formItem: FormItems | undefined | null;
    questionnaireItem: FCEQuestionnaireItem | undefined | null;
}) => {
    const { formItem, questionnaireItem } = props;
    const emptySymbol = '-';

    if (!formItem || !questionnaireItem) {
        return emptySymbol;
    }

    const questionnaireItemType = questionnaireItem.type;

    if (!isFormAnswerItems(formItem)) {
        return emptySymbol;
    }
    const answerValues = getAnswerValues(formItem);

    if (answerValues.length === 0) {
        return emptySymbol;
    }

    if (_.some(answerValues, (answerValue) => isAnswerValueEmpty(answerValue))) {
        return emptySymbol;
    }

    return (
        <>
            {answerValues
                .map((value) => getValueFromAnswerValue(value, questionnaireItemType, true) ?? emptySymbol)
                .join(', ')}
        </>
    );
};
