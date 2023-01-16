import classNames from 'classnames';
import _ from 'lodash';
import { QuestionItemProps, useQuestionnaireResponseFormContext } from 'sdc-qrf';

import s from './ReadonlyWidgets.module.scss';

export function QuestionText({ parentPath, questionItem }: QuestionItemProps) {
    const qrfContext = useQuestionnaireResponseFormContext();
    const { linkId, text, hidden } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'string'];
    const valueDisplay = _.get(qrfContext.formValues, fieldName);

    if (hidden) {
        return null;
    }

    return (
        <p className={classNames(s.question, s.column)}>
            <span className={s.questionText}>{text}</span>
            <span>{valueDisplay || 'No answer provided'}</span>
        </p>
    );
}
