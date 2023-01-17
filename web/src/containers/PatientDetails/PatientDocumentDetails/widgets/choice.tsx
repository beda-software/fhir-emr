import classNames from 'classnames';
import _ from 'lodash';
import { QuestionItemProps, useQuestionnaireResponseFormContext } from 'sdc-qrf';

import { getDisplay } from 'src/utils/questionnaire';

import s from './ReadonlyWidgets.module.scss';

export function QuestionChoice({ parentPath, questionItem }: QuestionItemProps) {
    const qrfContext = useQuestionnaireResponseFormContext();
    const { linkId, text, repeats, hidden } = questionItem;

    if (hidden) {
        return null;
    }

    if (repeats) {
        const fieldName = [...parentPath, linkId];
        const valueDisplay = getDisplay(_.get(qrfContext.formValues, fieldName)?.value);

        return (
            <p className={classNames(s.question, s.row)}>
                <span className={s.questionText}>{text}</span>
                <span className={s.answer}>{valueDisplay || 'No answer provided'}</span>
            </p>
        );
    } else {
        const fieldName = [...parentPath, linkId, 0];
        const valueDisplay = getDisplay(_.get(qrfContext.formValues, fieldName)?.value);

        return (
            <p className={classNames(s.question, s.row)}>
                <span className={s.questionText}>{text}</span>
                <span className={s.answer}>{valueDisplay || 'No answer provided'}</span>
            </p>
        );
    }
}
