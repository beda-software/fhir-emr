import classNames from 'classnames';
import Markdown from 'react-markdown';
import { QuestionItemProps } from 'sdc-qrf';

import { useFieldController } from 'src/components/BaseQuestionnaireResponseForm/hooks';

import s from '../ReadonlyWidgets.module.scss';
import { S } from '../ReadonlyWidgets.styles';

export function MarkdownRenderControl({ parentPath, questionItem }: QuestionItemProps) {
    const { linkId, text } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'string'];
    const { value } = useFieldController(fieldName, questionItem);

    return (
        <S.Question className={classNames(s.question, s.column, 'form__question')}>
            <span className={s.questionText}>{text}</span>
            <Markdown>{value || '-'}</Markdown>
        </S.Question>
    );
}
