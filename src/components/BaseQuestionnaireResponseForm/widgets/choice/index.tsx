import { Form } from 'antd';
import _, { debounce } from 'lodash';
import { useCallback, useContext } from 'react';
import { QuestionItemProps } from 'sdc-qrf';

import { QuestionnaireItemAnswerOption, QuestionnaireResponseItemAnswer } from 'shared/src/contrib/aidbox';

import { AsyncSelect, Select } from 'src/components/Select';
import { getDisplay } from 'src/utils/questionnaire';

import { ExpandProvider } from './context';
import s from '../../BaseQuestionnaireResponseForm.module.scss';
import { useFieldController } from '../../hooks';

interface ChoiceQuestionSelectProps {
    value?: QuestionnaireResponseItemAnswer[];
    onChange: (...option: any[]) => void;
    options: QuestionnaireItemAnswerOption[];
    repeats?: boolean;
    placeholder?: string;
}

export function ChoiceQuestionSelect(props: ChoiceQuestionSelectProps) {
    const { value, onChange, options, repeats = false, placeholder } = props;

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

export function QuestionChoice({ parentPath, questionItem }: QuestionItemProps) {
    const { linkId, answerOption, repeats, answerValueSet } = questionItem;
    const fieldName = [...parentPath, linkId];

    const { value, formItem, onChange, placeholder } = useFieldController(fieldName, questionItem);

    const onSelect = useCallback((option: any) => onChange([].concat(option)), [onChange]);

    if (answerValueSet) {
        return (
            <Form.Item {...formItem} data-testid="question-choice">
                <ChoiceQuestionValueSet
                    answerValueSet={answerValueSet}
                    value={value}
                    onChange={onSelect}
                    repeats={repeats}
                    placeholder={placeholder}
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
}

export function ChoiceQuestionValueSet(props: ChoiceQuestionValueSetProps) {
    const { answerValueSet, value, onChange, repeats = false, placeholder } = props;
    const expand = useContext(ExpandProvider);

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
