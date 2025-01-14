import classNames from 'classnames';
import { Coding, Quantity } from 'fhir/r4b';
import _ from 'lodash';
import { QuestionItemProps } from 'sdc-qrf';

import { useFieldController } from 'src/components/BaseQuestionnaireResponseForm/hooks';
import { formatUnit } from 'src/utils/unit';

import s from './ReadonlyWidgets.module.scss';
import { S } from './ReadonlyWidgets.styles';

export function QuestionInteger({ parentPath, questionItem }: QuestionItemProps) {
    const { linkId, text, hidden } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'integer'];
    const { value } = useFieldController(fieldName, questionItem);

    if (hidden) {
        return null;
    }

    const { unit } = questionItem as { unit?: Coding };

    return (
        <S.Question className={classNames(s.question, s.row, 'form__question')}>
            <span className={s.questionText}>{text}</span>
            <span className={s.answer}>{_.isNumber(value) ? `${value} ${formatUnit(unit?.display)}` : '-'}</span>
        </S.Question>
    );
}

export function QuestionDecimal({ parentPath, questionItem }: QuestionItemProps) {
    const { linkId, text, hidden } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'decimal'];
    const { value } = useFieldController(fieldName, questionItem);

    if (hidden) {
        return null;
    }

    const { unit } = questionItem as { unit?: Coding };

    return (
        <S.Question className={classNames(s.question, s.row, 'form__question')}>
            <span className={s.questionText}>{text}</span>
            <span className={s.answer}>{_.isNumber(value) ? `${value} ${formatUnit(unit?.display)}` : '-'}</span>
        </S.Question>
    );
}

export function QuestionQuantity({ parentPath, questionItem }: QuestionItemProps) {
    const { linkId, text, hidden } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value'];
    const { value } = useFieldController(fieldName, questionItem);
    const quantity: Quantity | undefined = value?.Quantity;

    if (hidden) {
        return null;
    }

    return (
        <S.Question className={classNames(s.question, s.row, 'form__question')}>
            <span className={s.questionText}>{text}</span>
            <span className={s.answer}>
                {quantity && _.isNumber(quantity?.value) ? `${quantity.value} ${quantity.unit}` : '-'}
            </span>
        </S.Question>
    );
}
