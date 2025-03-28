import classNames from 'classnames';
import Markdown from 'react-markdown';
import { QuestionItemProps } from 'sdc-qrf';

import s from './ReadonlyWidgets.module.scss';
import { S } from './ReadonlyWidgets.styles';
import { TextWithLink } from '../widgets/display';

export function Display({ questionItem }: QuestionItemProps) {
    const { text, hidden, itemControl } = questionItem;

    const isMarkdown = itemControl?.coding?.[0]?.code == 'markdown';

    if (hidden) {
        return null;
    }

    return (
        <S.Question className={classNames(s.question, s.column, 'form__question')}>
            <span className={s.questionText}>
                {isMarkdown ? <Markdown>{text}</Markdown> : <TextWithLink text={text} />}
            </span>
        </S.Question>
    );
}
