import classNames from 'classnames';

import { Resource } from 'shared/src/contrib/aidbox';

import { getArrayDisplay, getDisplay } from 'src/utils/questionnaire';

import { AnswerReferenceProps, useAnswerReference } from '../widgets/reference';
import s from './ReadonlyWidgets.module.scss';
import { S } from './ReadonlyWidgets.styles';

function QuestionReferenceUnsafe<R extends Resource = any, IR extends Resource = any>(
    props: AnswerReferenceProps<R, IR>,
) {
    const { fieldController, text, repeats } = useAnswerReference(props);

    if (repeats) {
        return (
            <S.Question className={classNames(s.question, s.row, 'form__question')}>
                <span className={s.questionText}>{text}</span>
                <span className={s.answer}>{getArrayDisplay(fieldController.value?.value) || '-'}</span>
            </S.Question>
        );
    } else {
        return (
            <S.Question className={classNames(s.question, s.row, 'form__question')}>
                <span className={s.questionText}>{text}</span>
                <span className={s.answer}>{getDisplay(fieldController.value?.value) || '-'}</span>
            </S.Question>
        );
    }
}

export function QuestionReference<R extends Resource = any, IR extends Resource = any>(
    props: AnswerReferenceProps<R, IR>,
) {
    const { answerExpression, choiceColumn, linkId } = props.questionItem;

    if (!answerExpression || !choiceColumn) {
        console.warn(`answerExpression and choiceColumn must be set for linkId '${linkId}'`);
        return null;
    }

    return <QuestionReferenceUnsafe {...props} />;
}
