import classNames from 'classnames';
import { QuestionItemProps } from 'sdc-qrf';

import { useFieldController } from 'src/components/BaseQuestionnaireResponseForm/hooks';

import s from './ReadonlyWidgets.module.scss';
import { S } from './ReadonlyWidgets.styles';

export function QuestionText({ parentPath, questionItem }: QuestionItemProps) {
    const { linkId, text, hidden } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'string'];
    const { value } = useFieldController(fieldName, questionItem);

    if (hidden) {
        return null;
    }

    const renderedText = (text ?? '').replace('<input/>', value || '').replace(/<input\/>/g, '');

    return (
        <S.Question className={classNames(s.question, s.column, 'form__question')}>
            <span className={s.questionText}>{renderedText}</span>
        </S.Question>
    );
}
