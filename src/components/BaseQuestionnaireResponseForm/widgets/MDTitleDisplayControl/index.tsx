import classNames from 'classnames';
import { QuestionItemProps } from 'sdc-qrf';

import { useFieldController } from 'src/components/BaseQuestionnaireResponseForm/hooks';
import s from 'src/components/BaseQuestionnaireResponseForm/readonly-widgets/ReadonlyWidgets.module.scss';
import { S } from 'src/components/BaseQuestionnaireResponseForm/readonly-widgets/ReadonlyWidgets.styles';

import { STitle } from './styles';

export function MDTitleDisplayControl({ parentPath, questionItem }: QuestionItemProps) {
    const { linkId, hidden } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'string'];
    const { value } = useFieldController(fieldName, questionItem);

    if (hidden) {
        return null;
    }

    return (
        <S.Question className={classNames(s.question, s.column, 'form__question')}>
            <span className={s.questionText}>{value}</span>
            <STitle.Divider />
        </S.Question>
    );
}
