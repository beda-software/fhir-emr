import classNames from 'classnames';
import { QuestionItemProps } from 'sdc-qrf';

import { useFieldController } from 'src/components/BaseQuestionnaireResponseForm/hooks';
import { formatUnit } from 'src/utils/unit';

import s from '../ReadonlyWidgets.module.scss';
import { BMI } from './BMI';

export function QuestionInteger({ parentPath, questionItem }: QuestionItemProps) {
    const { linkId, text, hidden } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'integer'];
    const { value } = useFieldController(fieldName, questionItem);

    if (hidden) {
        return null;
    }

    const { unit } = questionItem as { unit?: string };

    if (linkId === 'bmi') {
        return <BMI text={text} value={value} unit={unit} />;
    }

    return (
        <p className={classNames(s.question, s.row, 'form__question')}>
            <span className={s.questionText}>{text}</span>
            <span className={s.answer}>{value ? `${value} ${formatUnit(unit)}` : '-'}</span>
        </p>
    );
}
