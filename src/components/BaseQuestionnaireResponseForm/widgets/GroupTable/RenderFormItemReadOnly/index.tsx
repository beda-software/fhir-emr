import _ from 'lodash';
import { FCEQuestionnaireItem, FormAnswerItems, FormGroupItems, getAnswerValues, isAnswerValueEmpty } from 'sdc-qrf';

import { MarkdownRender } from 'src/components/BaseQuestionnaireResponseForm/readonly-widgets/MarkdownRender';

import { getValueFromAnswerValue, isFormAnswerItems } from '../utils';

export const RenderFormItemReadOnly = (props: {
    formItem: FormGroupItems | (FormAnswerItems | undefined)[] | undefined;
    questionnaireItem: FCEQuestionnaireItem | undefined | null;
}) => {
    const { formItem, questionnaireItem } = props;
    const emptySymbol = '-';

    if (!formItem || !questionnaireItem) {
        return emptySymbol;
    }

    const questionnaireItemType = questionnaireItem.type;
    const itemControl = questionnaireItem.itemControl?.coding?.[0]?.code;
    const isMarkdownString = itemControl === 'markdown-editor';

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
            {isMarkdownString
                ? answerValues.map((value, index) => <MarkdownRender key={index} text={value.string ?? ''} />)
                : answerValues
                      .map((value) => getValueFromAnswerValue(value, questionnaireItemType, true) ?? emptySymbol)
                      .join(', ')}
        </>
    );
};
