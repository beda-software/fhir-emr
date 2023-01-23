import classNames from 'classnames';
import _ from 'lodash';
import { QuestionItemProps } from 'sdc-qrf';

import { useFieldController } from 'src/components/BaseQuestionnaireResponseForm/hooks';

import s from './ReadonlyWidgets.module.scss';

export function QuestionText({ parentPath, questionItem }: QuestionItemProps) {
    const { linkId, text, hidden } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'string'];
    const { value } = useFieldController(fieldName, questionItem);

    if (hidden) {
        return null;
    }

    return (
        <p className={classNames(s.question, s.column)}>
            <span className={s.questionText}>{text}</span>
            <span>{value || '-'}</span>
        </p>
    );
}
