import { Form } from 'antd';
import { mapSuccess } from 'fhir-react';
import { debounce } from 'lodash';
import _ from 'lodash';
import { useCallback } from 'react';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import { QuestionItemProps } from 'sdc-qrf';

import { isSuccess } from 'aidbox-react/lib/libs/remoteData';
import { service } from 'aidbox-react/lib/services/service';

import { QuestionnaireItemAnswerOption, QuestionnaireResponseItemAnswer, ValueSet } from 'shared/src/contrib/aidbox';

import { getDisplay } from 'src/utils/questionnaire';

import s from '../BaseQuestionnaireResponseForm.module.scss';
import { useFieldController } from '../hooks';

interface ChoiceQuestionSelectProps {
    value?: QuestionnaireResponseItemAnswer[];
    onChange: (...option: any[]) => void;
    options: QuestionnaireItemAnswerOption[];
    repeats?: boolean;
}

function ChoiceQuestionSelect(props: ChoiceQuestionSelectProps) {
    const { value, onChange, options, repeats = false } = props;

    return (
        <>
            <Select
                value={value}
                options={options}
                className={s.select}
                onChange={(v) => onChange(v)}
                isOptionSelected={(option) =>
                    !!value && value?.findIndex((v) => _.isEqual(v?.value, option.value)) !== -1
                }
                isMulti={repeats}
                getOptionLabel={(o) => (getDisplay(o.value) as string) || ''}
            />
        </>
    );
}

export function QuestionChoice({ parentPath, questionItem }: QuestionItemProps) {
    const { linkId, answerOption, repeats, answerValueSet } = questionItem;
    let fieldName = [...parentPath, linkId, 0];

    if (repeats) {
        fieldName = [...parentPath, linkId];
    }

    const { value, formItem, onChange } = useFieldController(fieldName, questionItem);

    if (answerValueSet) {
        return (
            <Form.Item {...formItem}>
                <ChoiceQuestionValueSet
                    answerValueSet={answerValueSet}
                    value={!repeats && value ? [value] : value}
                    onChange={onChange}
                    repeats={repeats}
                />
            </Form.Item>
        );
    }

    return (
        <Form.Item {...formItem}>
            <ChoiceQuestionSelect
                options={answerOption!}
                value={!repeats && value ? [value] : value}
                onChange={onChange}
                repeats={repeats}
            />
        </Form.Item>
    );
}

interface ChoiceQuestionValueSetProps {
    answerValueSet: string;
    value: QuestionnaireResponseItemAnswer[];
    onChange: (option: any) => void;
    repeats?: boolean;
}

function ChoiceQuestionValueSet(props: ChoiceQuestionValueSetProps) {
    const { answerValueSet, value, onChange, repeats = false } = props;
    const valueSetId = answerValueSet.split('/').slice(-1);

    const loadOptions = useCallback(
        async (searchText: string) => {
            const response = mapSuccess(
                await service<ValueSet>({
                    url: `ValueSet/${valueSetId}/$expand`,
                    params: {
                        filter: searchText,
                        count: 50,
                    },
                }),
                (expandedValueSet) => {
                    const expansionEntries = Array.isArray(expandedValueSet.expansion?.contains)
                        ? expandedValueSet.expansion!.contains
                        : [];

                    return expansionEntries.map(({ code, system, display }) => ({
                        value: { Coding: { code, system, display } },
                    }));
                },
            );

            if (isSuccess(response)) {
                return response.data;
            }
            return [];
        },
        [valueSetId],
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
        />
    );
}
