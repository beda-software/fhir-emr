import classNames from 'classnames';
import { QuestionItemProps } from 'sdc-qrf';

import { Coding } from 'shared/src/contrib/aidbox';

import { useFieldController } from 'src/components/BaseQuestionnaireResponseForm/hooks';
import { formatUnit } from 'src/utils/unit';

import s from './ReadonlyWidgets.module.scss';

export function QuestionInteger({ parentPath, questionItem }: QuestionItemProps) {
    const { linkId, text, hidden } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'integer'];
    const { value } = useFieldController(fieldName, questionItem);

    if (hidden) {
        return null;
    }

    const { unit } = questionItem as { unit?: Coding };

    return (
        <p className={classNames(s.question, s.row, 'form__question')}>
            <span className={s.questionText}>{text}</span>
            <span className={s.answer}>{value ? `${value} ${formatUnit(unit?.display)}` : '-'}</span>
        </p>
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
        <p className={classNames(s.question, s.row, 'form__question')}>
            <span className={s.questionText}>{text}</span>
            <span className={s.answer}>{value ? `${value} ${formatUnit(unit?.display)}` : '-'}</span>
        </p>
    );
}
