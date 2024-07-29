import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Trans, t } from '@lingui/macro';
import { Button, Checkbox, Empty, Form, Input } from 'antd';
import { Coding, ValueSet } from 'fhir/r4b';
import _ from 'lodash';
import { useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { service } from 'aidbox-react/lib/services/service';

import { QuestionnaireItemAnswerOption } from '@beda.software/aidbox-types';
import {
    WithId,
    extractBundleResources,
    formatFHIRDate,
    formatFHIRTime,
    parseFHIRDate,
    parseFHIRTime,
    useService,
} from '@beda.software/fhir-react';
import { isLoading, isSuccess, mapSuccess } from '@beda.software/remote-data';

import { DatePicker } from 'src/components/DatePicker';
import { ModalTrigger } from 'src/components/ModalTrigger';
import { AsyncSelect } from 'src/components/Select';
import { SpinIndicator } from 'src/components/Spinner';
import { Table } from 'src/components/Table';
import { getFHIRResources } from 'src/services/fhir';
import { humanDate, humanTime } from 'src/utils/date';

import { S } from './QuestionnaireItemSettings.styles';
import { SettingsField, SettingsFieldArray } from './SettingsField';

export function getItemControls(): {
    [key: string]: Array<{ label: string; code: string | undefined; default?: boolean }>;
} {
    return {
        choice: [
            { label: t`Select (default)`, code: undefined, default: true },
            { label: t`Inline choice`, code: 'inline-choice' },
            { label: t`Solid radio button`, code: 'solid-radio-button' },
        ],
        string: [
            { label: t`Text (default)`, code: undefined, default: true },
            { label: t`Phone widget`, code: 'phoneWidget' },
        ],
        text: [
            { label: t`Text (default)`, code: undefined, default: true },
            { label: t`Text with macro`, code: 'text-with-macro' },
        ],
        decimal: [
            { label: t`Number (default)`, code: undefined, default: true },
            { label: t`Slider`, code: 'slider' },
        ],
        integer: [
            // { label: 'Anxiety score', code: 'anxiety-score' },
            // { label: 'Depression score', code: 'depression-score' },
        ],
        dateTime: [
            { label: t`Default`, code: undefined, default: true },
            { label: t`Date & time slot`, code: 'date-time-slot' },
        ],
        group: [
            { label: t`Col (default)`, code: undefined, default: true },
            // { label: t`Blood pressure`, code: 'blood-pressure' },
            // { label: t`Time range picker`, code: 'time-range-picker' }, --- obsolete?
            { label: t`Row`, code: 'row' },
            // { label: t`Col`, code: 'col' },
        ],
    };
}

export const typeSpecificFields = {
    choice: <ChoiceFields />,
};

export const itemControlSpecificFields = {
    'solid-radio-button': <SolidRadioButtonFields />,
    'text-with-macro': <TextWithMacroFields />,
    slider: <SliderFields />,
};

function SolidRadioButtonFields() {
    return (
        <SettingsField name="adjustLastToRight">
            {({ field }) => (
                <Form.Item valuePropName="checked">
                    <Checkbox onChange={field.onChange} checked={field.value}>
                        <Trans>Adjust Last Option Right</Trans>
                    </Checkbox>
                </Form.Item>
            )}
        </SettingsField>
    );
}

function TextWithMacroFields() {
    return (
        <SettingsField name="macro">
            {({ field }) => (
                <Form.Item label={t`Macro text`} required>
                    <Input value={field.value} onChange={field.onChange} onBlur={field.onBlur} />
                </Form.Item>
            )}
        </SettingsField>
    );
}

function SliderFields() {
    return (
        <>
            <SettingsField name="start">
                {({ field }) => (
                    <Form.Item label={t`Start value`} required>
                        <Input value={field.value} onChange={field.onChange} onBlur={field.onBlur} type="number" />
                    </Form.Item>
                )}
            </SettingsField>
            <SettingsField name="stop">
                {({ field }) => (
                    <Form.Item label={t`Stop value`} required>
                        <Input value={field.value} onChange={field.onChange} onBlur={field.onBlur} type="number" />
                    </Form.Item>
                )}
            </SettingsField>
            <SettingsField name="sliderStepValue">
                {({ field }) => (
                    <Form.Item label={t`Step`} required>
                        <Input value={field.value} onChange={field.onChange} onBlur={field.onBlur} type="number" />
                    </Form.Item>
                )}
            </SettingsField>
            <SettingsField name="stopLabel">
                {({ field }) => (
                    <Form.Item label={t`Stop label`}>
                        <Input value={field.value} onChange={field.onChange} onBlur={field.onBlur} />
                    </Form.Item>
                )}
            </SettingsField>
            <SettingsField name="helpText">
                {({ field }) => (
                    <Form.Item label={t`Help text`}>
                        <Input value={field.value} onChange={field.onChange} onBlur={field.onBlur} />
                    </Form.Item>
                )}
            </SettingsField>
        </>
    );
}

function ChoiceFields() {
    const { watch, setValue } = useFormContext();
    const formValues = watch();
    const answerOptions: QuestionnaireItemAnswerOption[] = useMemo(
        () => _.get(formValues, ['answerOption'], []),
        [formValues],
    );
    const system = useMemo(() => _.get(formValues, ['answerOption', 0, 'value', 'Coding', 'system']), [formValues]);
    const [showInlineOptions, setShowInlineOptions] = useState(answerOptions.length > 0);

    const renderOption = (index: number) => {
        if (answerOptions[0]?.value?.Coding) {
            return (
                <>
                    <SettingsField name={`answerOption.${index}.value.Coding.display`}>
                        {({ field }) => (
                            <>
                                <Form.Item label={t`Option ${index + 1}`} required>
                                    <Input value={field.value} onChange={field.onChange} onBlur={field.onBlur} />
                                </Form.Item>
                            </>
                        )}
                    </SettingsField>
                    <SettingsField name={`answerOption.${index}.value.Coding.code`}>
                        {({ field }) => (
                            <>
                                <Form.Item label={t`Code`} required>
                                    <Input value={field.value} onChange={field.onChange} onBlur={field.onBlur} />
                                </Form.Item>
                            </>
                        )}
                    </SettingsField>
                </>
            );
        } else if (answerOptions[0]?.value?.integer) {
            <SettingsField name={`answerOption.${index}.value.integer`}>
                {({ field }) => (
                    <Form.Item label={t`Option ${index}`} required>
                        <Input value={field.value} onChange={field.onChange} onBlur={field.onBlur} type="number" />
                    </Form.Item>
                )}
            </SettingsField>;
        } else if (answerOptions[0]?.value?.date) {
            <SettingsField name={`answerOption.${index}.value.date`}>
                {({ field }) => (
                    <Form.Item label={t`Option ${index}`} required>
                        <DatePicker
                            showTime={false}
                            showNow={false}
                            showToday={false}
                            format={humanDate}
                            onChange={(date) => {
                                if (date) {
                                    field.onChange(formatFHIRDate(date));
                                }
                            }}
                            value={field.value ? parseFHIRDate(field.value) : undefined}
                        />
                    </Form.Item>
                )}
            </SettingsField>;
        } else if (answerOptions[0]?.value?.time) {
            <SettingsField name={`answerOption.${index}.value.time`}>
                {({ field }) => (
                    <Form.Item label={t`Option ${index}`} required>
                        <DatePicker
                            picker="time"
                            format={humanTime}
                            minuteStep={5}
                            onChange={(time) => {
                                if (time) {
                                    field.onChange(formatFHIRTime(time));
                                }
                            }}
                            value={field.value ? parseFHIRTime(field.value) : undefined}
                        />
                    </Form.Item>
                )}
            </SettingsField>;
        }

        return (
            <SettingsField name={`answerOption.${index}.value.string`}>
                {({ field }) => (
                    <Form.Item label={t`Option ${index}`} required>
                        <Input value={field.value} onChange={field.onChange} onBlur={field.onBlur} />
                    </Form.Item>
                )}
            </SettingsField>
        );
    };

    return (
        <>
            <div>
                <Checkbox
                    onChange={(e) => setShowInlineOptions(e.target.checked)}
                    checked={showInlineOptions}
                    style={{ marginBottom: 20 }}
                >
                    <Trans>Inline options?</Trans>
                </Checkbox>
            </div>
            {showInlineOptions ? (
                <>
                    <SettingsField name={`answerOption.0.value.Coding.system`}>
                        {({ field }) => (
                            <>
                                <Form.Item label={t`System`}>
                                    <Input
                                        value={field.value}
                                        onChange={field.onChange}
                                        onBlur={(v) => {
                                            setValue(
                                                'answerOption',
                                                answerOptions.map((o) => ({
                                                    ...o,
                                                    value: {
                                                        Coding: {
                                                            system,
                                                            code: o.value?.Coding?.code,
                                                            display: o.value?.Coding?.display,
                                                        },
                                                    },
                                                })),
                                            );
                                            field.onBlur();
                                        }}
                                    />
                                </Form.Item>
                            </>
                        )}
                    </SettingsField>
                    <SettingsFieldArray name="answerOption">
                        {({ fields, remove, append }) => (
                            <>
                                {fields.map((f, index) => {
                                    return (
                                        <S.Option key={`answerOption-${f.id}`}>
                                            <div style={{ flex: 1 }}>{renderOption(index)}</div>
                                            <div style={{ width: 40 }}>
                                                {fields.length > 1 ? (
                                                    <Button type="link" onClick={() => remove(index)}>
                                                        <MinusCircleOutlined />
                                                    </Button>
                                                ) : null}
                                            </div>
                                        </S.Option>
                                    );
                                })}
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button
                                        type="link"
                                        onClick={() => append(getNewOption(answerOptions[0], system))}
                                        style={{ marginBottom: 16, padding: 0 }}
                                    >
                                        <PlusCircleOutlined style={{ marginRight: 8 }} />
                                        <Trans>Add option</Trans>
                                    </Button>
                                </div>
                            </>
                        )}
                    </SettingsFieldArray>
                </>
            ) : (
                <ValueSetField />
            )}
        </>
    );
}

function getNewOption(
    answerOption?: QuestionnaireItemAnswerOption,
    system?: string,
): QuestionnaireItemAnswerOption | undefined {
    if (!answerOption?.value) {
        return undefined;
    }

    if (answerOption.value.Coding) {
        return { value: { Coding: { system: system || '', display: '', code: '' } } };
    } else if (answerOption.value.string) {
        return { value: { string: '' } };
    } else if (answerOption.value.integer) {
        return { value: { integer: undefined } };
    } else if (answerOption.value.date) {
        return { value: { date: undefined } };
    } else if (answerOption.value.time) {
        return { value: { time: undefined } };
    }

    // else if (answerOption.value.Reference) {
    //     return { value: { Reference: '' } };
    // }

    return undefined;
}

export function useValueSetField() {
    const [optionsData, setOptionsData] = useState<{ [key: string]: WithId<ValueSet> }>({});

    const loadOptions = async (searchText: string) => {
        const response = mapSuccess(await getFHIRResources<ValueSet>('ValueSet', { _ilike: searchText }), (bundle) => {
            const valueSets = extractBundleResources(bundle).ValueSet;

            return valueSets;
        });

        if (isSuccess(response)) {
            const valueSetMap = {};
            response.data.forEach((v) => (valueSetMap[`ValueSet/${v.id}`] = v));
            setOptionsData(valueSetMap);
            return response.data || [];
        }

        return [];
    };

    const debouncedLoadOptions = _.debounce((searchText: string, callback: (options: any) => void) => {
        (async () => callback(await loadOptions(searchText)))();
    }, 500);

    const validate = (inputValue: any) => {
        if (!inputValue) {
            return 'Required';
        }
    };

    return {
        optionsData,
        debouncedLoadOptions,
        validate,
    };
}

interface ValueSetFieldProps {
    onValueSetChange?: () => void;
}

function ValueSetField(props: ValueSetFieldProps) {
    const { debouncedLoadOptions, optionsData } = useValueSetField();
    const { watch, setValue } = useFormContext();
    const formValues = watch();
    const answerOptions: QuestionnaireItemAnswerOption[] = useMemo(
        () => _.get(formValues, ['answerOption'], []),
        [formValues],
    );

    return (
        <SettingsField name="answerValueSet">
            {({ field }) => {
                const valueSet = field.value ? optionsData[field.value] : undefined;

                return (
                    <Form.Item label={t`ValueSet url`} required>
                        <AsyncSelect
                            onChange={(option: any) => {
                                if (answerOptions.length) {
                                    setValue('answerOption', undefined);
                                }
                                field.onChange(`ValueSet/${option?.id}`);
                            }}
                            value={valueSet}
                            loadOptions={debouncedLoadOptions}
                            defaultOptions
                            formatOptionLabel={(option) => (
                                <div>
                                    {_.startCase(option.title || option.name || '')}
                                    <br />
                                    {option.description && (
                                        <i style={{ fontSize: 12, lineHeight: '14px' }}>{option.description}</i>
                                    )}
                                </div>
                            )}
                            getOptionValue={(option) => `ValueSet/${option.id}`}
                            isMulti={false}
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            {valueSet && (
                                <ModalTrigger
                                    title={t`ValueSet details`}
                                    trigger={
                                        <Button type="link" style={{ padding: 0 }}>{t`See ValueSet details`}</Button>
                                    }
                                >
                                    {() => <ValueSetDetails valueSet={valueSet} />}
                                </ModalTrigger>
                            )}
                        </div>
                    </Form.Item>
                );
            }}
        </SettingsField>
    );
}

interface ValueSetDetailsProps {
    valueSet: ValueSet;
}

function useValueSetDetails(props: ValueSetDetailsProps) {
    const { valueSet } = props;

    const [response] = useService(async () => {
        const r = await service<ValueSet>({
            url: `ValueSet/${valueSet.id}/$expand`,
            params: {
                count: 50,
            },
        });

        return mapSuccess(r, (expandedValueSet) => {
            const expansionEntries = Array.isArray(expandedValueSet.expansion?.contains)
                ? expandedValueSet.expansion!.contains
                : [];

            return expansionEntries;
        });
    }, [valueSet]);

    return { response };
}

function ValueSetDetails(props: ValueSetDetailsProps) {
    const { valueSet } = props;
    const { response } = useValueSetDetails(props);

    return (
        <>
            {valueSet?.description && (
                <div>
                    <i>{t`Description:`}</i> {valueSet.description}
                </div>
            )}
            {valueSet?.url && (
                <div>
                    <i>{t`Url:`}</i>{' '}
                    <a href={valueSet.url} target="_blank" rel="noreferrer">
                        {valueSet.url}
                    </a>
                </div>
            )}
            <br />
            <i>{t`Concepts:`}</i>
            <Table<Coding>
                pagination={false}
                locale={{
                    emptyText: (
                        <>
                            <Empty description={<Trans>No data</Trans>} image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        </>
                    ),
                }}
                rowKey={(p) => p.id!}
                dataSource={isSuccess(response) ? response.data : []}
                columns={[
                    {
                        title: <Trans>Display</Trans>,
                        dataIndex: 'display',
                        key: 'display',
                        render: (_text, resource) => resource.display,
                    },
                    {
                        title: <Trans>Code</Trans>,
                        dataIndex: 'code',
                        key: 'code',
                        render: (_text, resource) => resource.code,
                    },
                ]}
                loading={isLoading(response) && { indicator: SpinIndicator }}
            />
        </>
    );
}
