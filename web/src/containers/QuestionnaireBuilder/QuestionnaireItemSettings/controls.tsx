import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Trans, t } from '@lingui/macro';
import { Button, Checkbox, Form, Input } from 'antd';
import { formatFHIRDate, formatFHIRTime, parseFHIRDate } from 'fhir-react';
import { parseFHIRTime } from 'fhir-react';
import _ from 'lodash';
import { useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { QuestionnaireItemAnswerOption } from 'shared/src/contrib/aidbox';
import { humanDate, humanTime } from 'shared/src/utils/date';

import { DatePicker } from 'src/components/DatePicker';

import s from './QuestionnaireItemSettings.module.scss';
import { SettingsField, SettingsFieldArray } from './SettingsField';

export const itemControls: { [key: string]: Array<{ label: string; code: string | null }> } = {
    choice: [
        { label: t`Select (default)`, code: null },
        { label: t`Inline choice`, code: 'inline-choice' },
        { label: t`Solid radio button`, code: 'solid-radio-button' },
    ],
    string: [
        { label: t`Text (default)`, code: null },
        { label: t`Phone widget`, code: 'phoneWidget' },
    ],
    text: [
        { label: t`Text (default)`, code: null },
        { label: t`Text with macro`, code: 'text-with-macro' },
    ],
    decimal: [
        { label: t`Number (default)`, code: null },
        { label: t`Slider`, code: 'slider' },
    ],
    integer: [
        // { label: 'Anxiety score', code: 'anxiety-score' },
        // { label: 'Depression score', code: 'depression-score' },
    ],
    dateTime: [
        { label: t`Default`, code: null },
        { label: t`Date & time slot`, code: 'date-time-slot' },
    ],
    group: [
        { label: t`Col (default)`, code: null },
        // { label: t`Blood pressure`, code: 'blood-pressure' },
        // { label: t`Time range picker`, code: 'time-range-picker' }, --- obsolete?
        { label: t`Row`, code: 'row' },
        // { label: t`Col`, code: 'col' },
    ],
};

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
                                        <div key={`answerOption-${f.id}`} className={s.option}>
                                            <div style={{ flex: 1 }}>{renderOption(index)}</div>
                                            <div style={{ width: 40 }}>
                                                {fields.length > 1 ? (
                                                    <Button type="link" onClick={() => remove(index)}>
                                                        <MinusCircleOutlined />
                                                    </Button>
                                                ) : null}
                                            </div>
                                        </div>
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
                <SettingsField name="answerValueSet">
                    {({ field }) => (
                        <Form.Item label={t`ValueSet url`}>
                            <Input value={field.value} onChange={field.onChange} onBlur={field.onBlur} />
                        </Form.Item>
                    )}
                </SettingsField>
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
