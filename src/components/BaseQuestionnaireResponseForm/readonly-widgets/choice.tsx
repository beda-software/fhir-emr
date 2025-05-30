import classNames from 'classnames';
import { FormAnswerItems, QuestionItemProps } from 'sdc-qrf';

import { useFieldController } from 'src/components/BaseQuestionnaireResponseForm/hooks';
import { getArrayDisplay, getDisplay } from 'src/utils/questionnaire';

import s from './ReadonlyWidgets.module.scss';
import { S } from './ReadonlyWidgets.styles';

export function QuestionChoice({ parentPath, questionItem }: QuestionItemProps) {
    const { linkId, text, repeats, hidden, choiceColumn } = questionItem;
    const fieldName = repeats ? [...parentPath, linkId] : [...parentPath, linkId, 0];
    const { value } = useFieldController<FormAnswerItems | FormAnswerItems[]>(fieldName, questionItem);

    if (hidden) {
        return null;
    }

    if (repeats) {
        return (
            <S.Question className={classNames(s.question, s.row, 'form__question')}>
                <span className={s.questionText}>{text}</span>
                <span className={s.answer}>
                    {getArrayDisplay(value as FormAnswerItems[] | undefined, choiceColumn) || '-'}
                </span>
            </S.Question>
        );
    } else {
        return (
            <S.Question className={classNames(s.question, s.row, 'form__question')}>
                <span className={s.questionText}>{text}</span>
                <span className={s.answer}>
                    {getDisplay((value as FormAnswerItems | undefined)?.value, choiceColumn) || '-'}
                </span>
            </S.Question>
        );
    }
}
