import classNames from 'classnames';
import _ from 'lodash';
import { QuestionItemProps, useQuestionnaireResponseFormContext } from 'sdc-qrf';

import s from './ReadonlyWidgets.module.scss';

function getAnxietyScoreInterpretation(score: number) {
    if (score <= 4) {
        return 'Minimal anxiety';
    } else if (score <= 9) {
        return 'Mild anxiety';
    } else if (score <= 14) {
        return 'Moderate anxiety';
    } else {
        return 'Severe anxiety';
    }
}

export function AnxietyScore({ parentPath, questionItem }: QuestionItemProps) {
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
                {typeof valueDisplay !== 'undefined'
                    ? `${valueDisplay} (${getAnxietyScoreInterpretation(valueDisplay)})`
                    : null}
            </span>
        </p>
    );
}

function getDepressionScoreInterpretation(score: number) {
    if (score <= 4) {
        return 'Minimal depression';
    } else if (score <= 9) {
        return 'Mild depression';
    } else if (score <= 14) {
        return 'Moderate depression';
    } else if (score <= 19) {
        return 'Moderately severe depression';
    } else {
        return 'Severed depression';
    }
}

export function DepressionScore({ parentPath, questionItem }: QuestionItemProps) {
    const qrfContext = useQuestionnaireResponseFormContext();
    const { linkId, text, hidden } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'integer'];
    const valueDisplay: number = _.get(qrfContext.formValues, fieldName);

    if (hidden) {
        return null;
    }

    return (
        <p className={classNames(s.question, s.row)}>
            <span className={s.questionText}>{text}</span>
            <span className={s.answer}>
                {typeof valueDisplay !== 'undefined'
                    ? `${valueDisplay} (${getDepressionScoreInterpretation(valueDisplay)})`
                    : null}
            </span>
        </p>
    );
}
