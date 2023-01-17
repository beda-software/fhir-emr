import classNames from 'classnames';
import _ from 'lodash';
import { QuestionItemProps, useQuestionnaireResponseFormContext } from 'sdc-qrf';

import s from './ReadonlyWidgets.module.scss';

export function QuestionInteger({ parentPath, questionItem }: QuestionItemProps) {
    const qrfContext = useQuestionnaireResponseFormContext();
    const { linkId, text, hidden } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'integer'];
    const valueDisplay: number | undefined = _.get(qrfContext.formValues, fieldName);

    if (hidden) {
        return null;
    }

    return (
        <p className={classNames(s.question, s.row)}>
            <span className={s.questionText}>{text}</span>
            <span className={s.answer}>
                {typeof valueDisplay !== 'undefined' ? valueDisplay : '-'}
            </span>
        </p>
    );
}
