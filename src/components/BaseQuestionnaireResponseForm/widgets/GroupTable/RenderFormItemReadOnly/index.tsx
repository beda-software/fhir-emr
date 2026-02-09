import _ from 'lodash';
import { AnswerValue, FCEQuestionnaireItem, FormItems, getAnswerValues, isAnswerValueEmpty } from 'sdc-qrf';

import { parseFHIRReference } from '@beda.software/fhir-react';

import { formatHumanDate, formatHumanDateTime, formatHumanTime } from 'src/utils';

import { isFormAnswerItems } from '../utils';

interface RenderQuestionnaireItemProps {
    items: AnswerValue[];
}

const RenderString = ({ items }: RenderQuestionnaireItemProps) => {
    return items.map((item) => item?.string || '-').join(', ');
};

const RenderDecimal = ({ items }: RenderQuestionnaireItemProps) => {
    return items.map((item) => item?.decimal?.toString() ?? '-').join(', ');
};

const RenderInteger = ({ items }: RenderQuestionnaireItemProps) => {
    return items.map((item) => item?.integer?.toString() ?? '-').join(', ');
};

const RenderDate = ({ items }: RenderQuestionnaireItemProps) => {
    return items.map((item) => formatHumanDate(item?.date) ?? '-').join(', ');
};

const RenderDateTime = ({ items }: RenderQuestionnaireItemProps) => {
    return items.map((item) => formatHumanDateTime(item?.dateTime) ?? '-').join(', ');
};

const RenderTime = ({ items }: RenderQuestionnaireItemProps) => {
    return items.map((item) => formatHumanTime(item?.time) ?? '-').join(', ');
};

const RenderBoolean = ({ items }: RenderQuestionnaireItemProps) => {
    return items.map((item) => (item?.boolean ? 'Yes' : 'No' ?? '-')).join(', ');
};

const RenderReference = ({ items }: RenderQuestionnaireItemProps) => {
    return items
        .map((item) => {
            if (!item.Reference) {
                return '-';
            }
            return item.Reference.display ?? parseFHIRReference(item.Reference).id ?? '-';
        })
        .join(', ');
};

const RenderQuantity = ({ items }: RenderQuestionnaireItemProps) => {
    return items
        .map((item) => {
            if (!item.Quantity) {
                return '-';
            }
            const value = item.Quantity.value;
            const unit = item.Quantity.unit;
            return value?.toString() + (unit ? ' ' + unit : '') ?? '-';
        })
        .join(', ');
};

const RenderAttachment = ({ items }: RenderQuestionnaireItemProps) => {
    return items
        .map((item) => {
            if (!item.Attachment) {
                return '-';
            }
            const title = item.Attachment.title;
            return title ?? '-';
        })
        .join(', ');
};

const RenderCoding = ({ items }: RenderQuestionnaireItemProps) => {
    return items
        .map((item) => {
            if (!item.Coding) {
                return '-';
            }
            const display = item.Coding.display;
            const code = item.Coding.code;
            return display ?? code ?? '-';
        })
        .join(', ');
};

export const RenderFormItemReadOnly = (props: {
    formItem: FormItems | undefined | null;
    questionnaireItem: FCEQuestionnaireItem | undefined | null;
}) => {
    const { formItem, questionnaireItem } = props;

    if (!formItem || !questionnaireItem) {
        return '-';
    }

    const questionnaireItemType = questionnaireItem.type;

    if (!isFormAnswerItems(formItem)) {
        return '-';
    }
    const answerValues = getAnswerValues(formItem);

    if (answerValues.length === 0) {
        return '-';
    }

    if (_.some(answerValues, (answerValue) => isAnswerValueEmpty(answerValue))) {
        return '-';
    }
    switch (questionnaireItemType) {
        case 'string':
            return <RenderString items={answerValues} />;
        case 'boolean':
            return <RenderBoolean items={answerValues} />;
        case 'date':
            return <RenderDate items={answerValues} />;
        case 'dateTime':
            return <RenderDateTime items={answerValues} />;
        case 'decimal':
            return <RenderDecimal items={answerValues} />;
        case 'integer':
            return <RenderInteger items={answerValues} />;
        case 'time':
            return <RenderTime items={answerValues} />;
        case 'text':
            return <RenderString items={answerValues} />;
        case 'choice':
            return <RenderCoding items={answerValues} />;
        case 'open-choice':
            return <RenderCoding items={answerValues} />;
        case 'attachment':
            return <RenderAttachment items={answerValues} />;
        case 'reference':
            return <RenderReference items={answerValues} />;
        case 'quantity':
            return <RenderQuantity items={answerValues} />;
        default:
            return '-';
    }
};
