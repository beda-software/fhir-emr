import { t } from '@lingui/macro';
import { Form } from 'antd';
import { QuestionnaireItemAnswerOption } from 'fhir/r4b';
import _, { debounce } from 'lodash';
import { useCallback, useContext } from 'react';
import { FCEQuestionnaireItemChoiceColumn, FormAnswerItems, QuestionItemProps, toAnswerValue } from 'sdc-qrf';

import { AsyncSelect, Select } from 'src/components/Select';
import { ValueSetExpandProvider } from 'src/contexts';
import { getDisplay } from 'src/utils/questionnaire';

import s from '../../BaseQuestionnaireResponseForm.module.scss';
import { useFieldController } from '../../hooks';

interface ChoiceQuestionSelectProps {
    value?: FormAnswerItems[];
    onChange: (...option: any[]) => void;
    options: QuestionnaireItemAnswerOption[];
    repeats?: boolean;
    placeholder?: string;
    choiceColumn?: FCEQuestionnaireItemChoiceColumn[];
    disabled?: boolean;
}

export function ChoiceQuestionSelect(props: ChoiceQuestionSelectProps) {
    const { value, onChange, options, repeats = false, placeholder = t`Select...`, choiceColumn, disabled } = props;

    return (
        <>
            <Select<FormAnswerItems>
                value={value}
                options={options.map((option) => ({ value: toAnswerValue(option, 'value')! }))}
                className={s.select}
                onChange={(v) => onChange(v)}
                isOptionSelected={(option) =>
                    !!value && value?.findIndex((v) => _.isEqual(v?.value, option.value)) !== -1
                }
                isMulti={repeats}
                getOptionLabel={(o) => (getDisplay(o.value, choiceColumn) as string) || ''}
                classNamePrefix="react-select"
                placeholder={placeholder}
                isDisabled={disabled}
            />
        </>
    );
}

export function QuestionChoice({ parentPath, questionItem }: QuestionItemProps) {
    const { linkId, answerOption, repeats, answerValueSet, choiceColumn } = questionItem;
    const fieldName = [...parentPath, linkId];

    const {
        value,
        formItem,
        onSelect,
        placeholder = t`Select...`,
        disabled,
    } = useFieldController<FormAnswerItems[]>(fieldName, questionItem);

    if (answerValueSet) {
        return (
            <Form.Item {...formItem} data-testid="question-choice">
                <ChoiceQuestionValueSet
                    answerValueSet={answerValueSet}
                    value={value ?? []}
                    onChange={onSelect}
                    repeats={repeats}
                    placeholder={placeholder}
                    choiceColumn={choiceColumn}
                    preferredTerminologyServer={questionItem.preferredTerminologyServer}
                    disabled={disabled}
                />
            </Form.Item>
        );
    }

    return (
        <Form.Item {...formItem} data-testid="question-choice">
            <ChoiceQuestionSelect
                options={answerOption ?? []}
                value={value ?? []}
                onChange={onSelect}
                repeats={repeats}
                placeholder={placeholder}
                choiceColumn={choiceColumn}
                disabled={disabled}
            />
        </Form.Item>
    );
}

interface ChoiceQuestionValueSetProps {
    answerValueSet: string;
    value: FormAnswerItems[];
    onChange: (option: FormAnswerItems[]) => void;
    repeats?: boolean;
    placeholder?: string;
    choiceColumn?: FCEQuestionnaireItemChoiceColumn[];
    preferredTerminologyServer?: string;
    disabled?: boolean;
}

export function ChoiceQuestionValueSet(props: ChoiceQuestionValueSetProps) {
    const {
        answerValueSet,
        value,
        onChange,
        repeats = false,
        placeholder,
        choiceColumn,
        preferredTerminologyServer,
        disabled,
    } = props;
    const expand = useContext(ValueSetExpandProvider);

    const loadOptions = useCallback(
        async (searchText: string) => {
            return expand(answerValueSet, searchText, preferredTerminologyServer);
        },
        [answerValueSet, expand, preferredTerminologyServer],
    );

    const debouncedLoadOptions = debounce((searchText, callback) => {
        (async () => callback(await loadOptions(searchText)))();
    }, 500);

    return (
        <AsyncSelect
            loadOptions={debouncedLoadOptions}
            defaultOptions
            value={value}
            onChange={(v) => onChange(v as FormAnswerItems[])}
            isOptionSelected={(option) => !!value && value?.findIndex((v) => _.isEqual(v?.value, option.value)) !== -1}
            isMulti={repeats}
            getOptionLabel={(o) => (getDisplay(o.value, choiceColumn) as string) || ''}
            placeholder={placeholder}
            isDisabled={disabled}
        />
    );
}
