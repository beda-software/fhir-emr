import _ from 'lodash';
import {
    AnswerValue,
    FCEQuestionnaireItem,
    FormAnswerItems,
    FormGroupItems,
    FormItems,
    getAnswerValueType,
    getAnswerValues,
    isAnswerValueEmpty,
} from 'sdc-qrf';

import { parseFHIRReference } from '@beda.software/fhir-react';

import { formatHumanDate, formatHumanDateTime, formatHumanTime } from 'src/utils';

const RenderString = (item: AnswerValue) => {
    return item?.string ?? '-';
};

const RenderDecimal = (item: AnswerValue) => {
    return item?.decimal?.toString() ?? '-';
};

const RenderInteger = (item: AnswerValue) => {
    return item?.integer?.toString() ?? '-';
};

const RenderDate = (item: AnswerValue) => {
    return formatHumanDate(item?.date) ?? '-';
};

const RenderDateTime = (item: AnswerValue) => {
    return formatHumanDateTime(item?.dateTime) ?? '-';
};

const RenderTime = (item: AnswerValue) => {
    return formatHumanTime(item?.time) ?? '-';
};

const RenderBoolean = (item: AnswerValue) => {
    return item?.boolean ? 'Yes' : 'No' ?? '-';
};

const RenderReference = (item: AnswerValue) => {
    if (!item.Reference) {
        return '-';
    }

    return item.Reference.display ?? parseFHIRReference(item.Reference).id ?? '-';
};

const RenderQuantity = (item: AnswerValue) => {
    if (!item.Quantity) {
        return '-';
    }
    const value = item.Quantity.value;
    const unit = item.Quantity.unit;

    return value?.toString() + (unit ? ' ' + unit : '') ?? '-';
};

const RenderAttachment = (item: AnswerValue) => {
    if (!item.Attachment) {
        return '-';
    }
    const title = item.Attachment.title;

    return title ?? '-';
};

const RenderUri = (item: AnswerValue) => {
    return item?.uri ?? '-';
};

const RenderCoding = (item: AnswerValue) => {
    if (!item.Coding) {
        return '-';
    }
    const display = item.Coding.display;
    const code = item.Coding.code;

    return display ?? code ?? '-';
};

const isAnswerValue = (
    item: FormGroupItems | (FormAnswerItems | undefined)[] | undefined,
): item is FormAnswerItems[] => {
    return Array.isArray(item) && item.every((item) => item !== undefined && item !== null && 'value' in item);
};

const valueTypeRenderMap: Record<string, (item: AnswerValue) => React.ReactNode> = {
    Attachment: RenderAttachment,
    boolean: RenderBoolean,
    Coding: RenderCoding,
    date: RenderDate,
    dateTime: RenderDateTime,
    decimal: RenderDecimal,
    integer: RenderInteger,
    Quantity: RenderQuantity,
    Reference: RenderReference,
    string: RenderString,
    time: RenderTime,
    uri: RenderUri,
};

export const RenderFormItemReadOnly = (props: {
    formItem: FormItems | undefined | null;
    questionnaireItem: FCEQuestionnaireItem | undefined | null;
}) => {
    const { formItem } = props;

    if (!formItem) {
        return '-';
    }

    if (!isAnswerValue(formItem)) {
        return '--';
    }
    const answerValues = getAnswerValues(formItem);

    if (_.some(answerValues, (answerValue) => isAnswerValueEmpty(answerValue))) {
        return '-';
    }

    return (
        <>
            {answerValues.map((answerValue, index: number) => {
                const valueType = getAnswerValueType(answerValue);
                if (!valueType) {
                    return '-';
                }

                const renderValue = valueTypeRenderMap[valueType];
                if (!renderValue) {
                    return '-';
                }

                return <div key={index.toString()}>{renderValue(answerValue) ?? '-'}</div>;
            })}
        </>
    );
};
