import classNames from 'classnames';

import { roundBmi } from 'src/utils/roundBmi';
import { formatUnit } from 'src/utils/unit';

import s from '../../ReadonlyWidgets.module.scss';

interface BMIProps {
    text?: string;
    value?: number;
    unit?: string;
}

export function BMI({ text, value, unit = '' }: BMIProps) {
    return (
        <p className={classNames(s.question, s.row, 'form__question')}>
            <span className={s.questionText}>{text}</span>
            <span className={s.answer}>
                {value ? `${roundBmi(value)} ${formatUnit(unit)}` : '-'}
            </span>
        </p>
    );
}
