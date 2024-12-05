import { t } from '@lingui/macro';
import { Form } from 'antd';
import _, { debounce } from 'lodash';
import { useCallback, useContext } from 'react';
import { QuestionItemProps } from 'sdc-qrf';

import {
    QuestionnaireItemAnswerOption,
    QuestionnaireItemChoiceColumn,
    QuestionnaireResponseItemAnswer,
} from '@beda.software/aidbox-types';

import { AsyncSelect, Select } from 'src/components/Select';
import { ValueSetExpandProvider } from 'src/contexts';
import { getDisplay } from 'src/utils/questionnaire';

import s from '../../BaseQuestionnaireResponseForm.module.scss';
import { useFieldController } from '../../hooks';

interface ChoiceQuestionSelectProps {
    value?: QuestionnaireResponseItemAnswer[];
    onChange: (...option: any[]) => void;
    options: QuestionnaireItemAnswerOption[];
    repeats?: boolean;
    placeholder?: string;
    choiceColumn?: QuestionnaireItemChoiceColumn[];
}

export function ChoiceQuestionSelect(props: ChoiceQuestionSelectProps) {
    const { value, onChange, options, repeats = false, placeholder = t`Select...`, choiceColumn } = props;

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
                getOptionLabel={(o) => (getDisplay(o.value, choiceColumn) as string) || ''}
                classNamePrefix="react-select"
                placeholder={placeholder}
            />
        </>
    );
}

export function QuestionChoice({ parentPath, questionItem }: QuestionItemProps) {
    const { linkId, answerOption, repeats, answerValueSet, choiceColumn } = questionItem;
    const fieldName = [...parentPath, linkId];

    const { value, formItem, onSelect, placeholder = t`Select...` } = useFieldController(fieldName, questionItem);

    if (answerValueSet) {
        return (
            <Form.Item {...formItem} data-testid="question-choice">
                <ChoiceQuestionValueSet
                    answerValueSet={answerValueSet}
                    value={value}
                    onChange={onSelect}
                    repeats={repeats}
                    placeholder={placeholder}
                    choiceColumn={choiceColumn}
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
                choiceColumn={choiceColumn}
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
    choiceColumn?: QuestionnaireItemChoiceColumn[];
}

export function ChoiceQuestionValueSet(props: ChoiceQuestionValueSetProps) {
    const { answerValueSet, value, onChange, repeats = false, placeholder, choiceColumn } = props;
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
            getOptionLabel={(o) => (getDisplay(o.value, choiceColumn) as string) || ''}
            placeholder={placeholder}
        />
    );
}
