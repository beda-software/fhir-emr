import { roundBmi } from 'src/utils/roundBmi';
import { formatUnit } from 'src/utils/unit';

import s from './styles.module.scss';

interface BMIProps {
    text?: string;
    value?: number;
    unit?: string;
}

export function BMI({ text, value, unit = '' }: BMIProps) {
    const bmi = value ? `${roundBmi(value)} ${formatUnit(unit)}` : '-';
    return (
        <p className={s.container}>
            <span className={s.title}>{text}</span>
            <span>{bmi}</span>
        </p>
    );
}
