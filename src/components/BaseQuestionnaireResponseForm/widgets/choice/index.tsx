import { t } from '@lingui/macro';
import { Form } from 'antd';
import _, { debounce } from 'lodash';
import { useCallback, useContext } from 'react';
import { QuestionItemProps } from 'sdc-qrf';

import { QuestionnaireItemAnswerOption, QuestionnaireResponseItemAnswer, QuestionnaireResponseItemAnswerValue } from '@beda.software/aidbox-types';

import { AsyncSelect, Select } from 'src/components/Select';
import { ValueSetExpandProvider } from 'src/contexts';
import { getDisplay as getAnswerValueDisplay } from 'src/utils/questionnaire';

import { evaluate } from 'src/utils';
import s from '../../BaseQuestionnaireResponseForm.module.scss';
import { useFieldController } from '../../hooks';

interface ChoiceQuestionSelectProps {
    value?: QuestionnaireResponseItemAnswer[];
    onChange: (...option: any[]) => void;
    options: QuestionnaireItemAnswerOption[];
    repeats?: boolean;
    placeholder?: string;
    getDisplay?: (value?: QuestionnaireResponseItemAnswerValue) => string | number | null;
}

export function ChoiceQuestionSelect(props: ChoiceQuestionSelectProps) {
    const { value, onChange, options, repeats = false, placeholder = t`Select...`, getDisplay = getAnswerValueDisplay } = props;

    return (
        <>
            <Select<QuestionnaireItemAnswerOption>
                value={value}
                options={options}
                className={s.select}
                onChange={(v) => onChange(v)}
                isOptionSelected={(option) =>
                    !!value && value?.findIndex((v) => _.isEqual(v?.value, option.value)) !== -1
                }
                isMulti={repeats}
                getOptionLabel={(o) => (getDisplay(o.value) as string) || ''}
                classNamePrefix="react-select"
                placeholder={placeholder}
            />
        </>
    );
}

export function QuestionChoice({ parentPath, questionItem, context }: QuestionItemProps) {
    const { linkId, answerOption, repeats, answerValueSet, choiceColumn } = questionItem;
    const fieldName = [...parentPath, linkId];

    const { value, formItem, onChange, placeholder = t`Select...` } = useFieldController(fieldName, questionItem);

    const onSelect = useCallback((option: any) => onChange([].concat(option)), [onChange]);

    const getDisplay = useCallback((value?: QuestionnaireResponseItemAnswerValue) => {
        const specificValueType = value && (Object.keys(value)[0] as keyof QuestionnaireResponseItemAnswerValue)
        if (choiceColumn && specificValueType) {
            return (evaluate(value[specificValueType], choiceColumn![0]!.path!, context)[0] ?? null) as string | number | null;
        }

        return getAnswerValueDisplay(value);
    }, [choiceColumn, context]);

    if (answerValueSet) {
        return (
            <Form.Item {...formItem} data-testid="question-choice">
                <ChoiceQuestionValueSet
                    answerValueSet={answerValueSet}
                    value={value}
                    onChange={onSelect}
                    repeats={repeats}
                    placeholder={placeholder}
                    getDisplay={getDisplay}
                />
            </Form.Item>
        );
    }

    return (
        <Form.Item {...formItem} data-testid="question-choice">
            <ChoiceQuestionSelect
                options={answerOption!}
                value={value}
                onChange={onSelect}
                repeats={repeats}
                placeholder={placeholder}
                getDisplay={getDisplay}
            />
        </Form.Item>
    );
}

interface ChoiceQuestionValueSetProps {
    answerValueSet: string;
    value: QuestionnaireResponseItemAnswer[];
    onChange: (option: any) => void;
    repeats?: boolean;
    placeholder?: string;
    getDisplay?: (value?: QuestionnaireResponseItemAnswerValue) => string | number | null;
}

export function ChoiceQuestionValueSet(props: ChoiceQuestionValueSetProps) {
    const { answerValueSet, value, onChange, repeats = false, placeholder, getDisplay = getAnswerValueDisplay } = props;
    const expand = useContext(ValueSetExpandProvider);

    const loadOptions = useCallback(
        async (searchText: string) => {
            return expand(answerValueSet, searchText);
        },
        [answerValueSet, expand],
    );

    const debouncedLoadOptions = debounce((searchText, callback) => {
        (async () => callback(await loadOptions(searchText)))();
    }, 500);

    return (
        <AsyncSelect
            loadOptions={debouncedLoadOptions}
            defaultOptions
            value={value}
            onChange={(v) => onChange(v)}
            isOptionSelected={(option) => !!value && value?.findIndex((v) => _.isEqual(v?.value, option.value)) !== -1}
            isMulti={repeats}
            getOptionLabel={(o) => (getDisplay(o.value) as string) || ''}
            placeholder={placeholder}
        />
    );
}
