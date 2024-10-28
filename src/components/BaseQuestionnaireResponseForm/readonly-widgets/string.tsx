import classNames from 'classnames';
import { Coding } from 'fhir/r4b';
import { QuestionItemProps } from 'sdc-qrf';

import { useFieldController } from 'src/components/BaseQuestionnaireResponseForm/hooks';
import { renderTextWithInput } from 'src/utils/renderTextWithInput';

import s from './ReadonlyWidgets.module.scss';
import { S } from './ReadonlyWidgets.styles';

export function QuestionText({ parentPath, questionItem }: QuestionItemProps) {
    const { linkId, text, hidden, itemControl } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'string'];
    const { value } = useFieldController(fieldName, questionItem);

    if (hidden) {
        return null;
    }
    
    const itemControlCoding = itemControl?.coding as Coding[] | undefined;
    const renderedText = renderTextWithInput(text, value, itemControlCoding);

    return (
        <S.Question className={classNames(s.question, s.column, 'form__question')}>
            <span className={s.questionText}>{renderedText}</span>
        </S.Question>
    );
}
