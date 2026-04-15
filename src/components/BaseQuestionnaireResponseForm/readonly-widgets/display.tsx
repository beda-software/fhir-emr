import classNames from 'classnames';
import { QuestionItemProps } from 'sdc-qrf';

import { TextWithLink } from '@beda.software/web-item-controls/controls';

import { MarkdownRender } from 'src/components/BaseQuestionnaireResponseForm/readonly-widgets/MarkdownRender';

import s from './ReadonlyWidgets.module.scss';
import { S } from './ReadonlyWidgets.styles';

export function Display({ questionItem }: QuestionItemProps) {
    const { text, hidden, itemControl } = questionItem;

    const isMarkdown = itemControl?.coding?.[0]?.code == 'markdown';

    if (hidden) {
        return null;
    }

    if (!text || text === '') {
        return null;
    }

    return (
        <S.Question className={classNames(s.question, s.column, 'form__question')}>
            <span className={s.questionText}>
                {isMarkdown ? <MarkdownRender text={text} /> : <TextWithLink text={text} />}
            </span>
        </S.Question>
    );
}
