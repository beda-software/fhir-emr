import { useEffect } from 'react';
import { useQuestionnaireResponseFormContext } from 'sdc-qrf';

import { formatUnit } from 'src/utils/unit';

import s from './styles.module.scss';

interface BMIProps {
    onChange: (newValue: number) => void;
    linkId: string;
    text?: string;
    value?: number;
    unit?: string;
}

export function BMI({ onChange, linkId, text, value, unit = '' }: BMIProps) {
    const { formValues } = useQuestionnaireResponseFormContext();
    const bmi = calculateBmi(
        formValues.weight?.[0].value.integer,
        formValues.height?.[0].value.integer,
    );

    useEffect(() => {
        if (linkId === 'bmi' && value !== bmi) {
            onChange(bmi);
        }
    }, [bmi, linkId, onChange, value]);

    const formattedUnit = formatUnit(unit);

    return (
        <p className={s.container}>
            <span className={s.title}>{text}</span>
            <span>{value ? `${value} ${formattedUnit}` : '-'}</span>
        </p>
    );
}

const calculateBmi = (weight?: number, height?: number): number => {
    if (weight && height) {
        const bmi = weight / (height / 100) ** 2;
        const roundedBmi = Math.round(bmi * 100) / 100;
        return roundedBmi;
    } else {
        return 0;
    }
};
