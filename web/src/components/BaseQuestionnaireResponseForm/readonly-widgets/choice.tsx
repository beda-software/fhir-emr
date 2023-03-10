import classNames from 'classnames';
import { QuestionItemProps } from 'sdc-qrf';

import { useFieldController } from 'src/components/BaseQuestionnaireResponseForm/hooks';
import { getArrayDisplay, getDisplay } from 'src/utils/questionnaire';

import s from './ReadonlyWidgets.module.scss';

export function QuestionChoice({ parentPath, questionItem }: QuestionItemProps) {
    const { linkId, text, repeats, hidden } = questionItem;
    const fieldName = repeats ? [...parentPath, linkId] : [...parentPath, linkId, 0];
    const { value } = useFieldController(fieldName, questionItem);

    if (hidden) {
        return null;
    }

    if (repeats) {
        return (
            <p className={classNames(s.question, s.row, 'form__question')}>
                <span className={s.questionText}>{text}</span>
                <span className={s.answer}>{getArrayDisplay(value) || '-'}</span>
            </p>
        );
    } else {
        return (
            <p className={classNames(s.question, s.row, 'form__question')}>
                <span className={s.questionText}>{text}</span>
                <span className={s.answer}>{getDisplay(value?.value) || '-'}</span>
            </p>
        );
    }
}
