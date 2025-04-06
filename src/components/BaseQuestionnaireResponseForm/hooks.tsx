import { FormItemProps } from 'antd';
import classNames from 'classnames';
import _ from 'lodash';
import { useCallback, useContext, useRef } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { FormItems, useQuestionnaireResponseFormContext } from 'sdc-qrf';

import { QuestionnaireItem } from '@beda.software/aidbox-types';
import { loading } from '@beda.software/remote-data';

import { BaseQuestionnaireResponseFormPropsContext } from 'src/components/BaseQuestionnaireResponseForm/context';
import { getFieldErrorMessage } from 'src/components/BaseQuestionnaireResponseForm/utils';
import { saveQuestionnaireResponseDraft } from 'src/components/QuestionnaireResponseForm';

import s from './BaseQuestionnaireResponseForm.module.scss';
import { FieldLabel } from './FieldLabel';

export function useFieldController(fieldName: any, questionItem: QuestionnaireItem) {
    const qrfContext = useQuestionnaireResponseFormContext();
    const { readOnly, hidden, repeats, text, required, entryFormat, helpText } = questionItem;
    const { control } = useFormContext();

    const { field, fieldState } = useController({
        control: control,
        name: fieldName.join('.'),
        ...(repeats ? { defaultValue: [] } : {}),
    });

    const invalidFieldMessage = getFieldErrorMessage(field, fieldState, text);

    const formItem: FormItemProps = {
        label: <FieldLabel questionItem={questionItem} />,
        hidden: hidden,
        validateStatus: fieldState?.invalid ? 'error' : 'success',
        help: invalidFieldMessage,
        required,
        className: classNames(s.field, {
            [s._hidden]: hidden,
        }),
    };

    const onMultiChange = useCallback(
        (option: any) => {
            // NOTE: it's used online in inline-choice
            if (repeats) {
                const arrayValue = (field.value ?? []) as any[];
                const valueIndex = arrayValue.findIndex((v) => _.isEqual(v?.value, option.value));

                if (valueIndex === -1) {
                    field.onChange([...arrayValue, option]);
                } else {
                    arrayValue.splice(valueIndex, 1);
                    field.onChange(arrayValue);
                }
            } else {
                field.onChange([option]);
            }
        },
        [repeats, field],
    );

    // This is a wrapper for react-select that always wrap single value into array
    const onSelect = useCallback((option: any) => field.onChange([].concat(option)), [field]);

    return {
        ...field,
        onMultiChange,
        onSelect,
        fieldState,
        disabled: readOnly || qrfContext.readOnly,
        formItem,
        placeholder: entryFormat,
        helpText,
    };
}

interface SaveDraftProps {
    debounceTimeout?: number;
}

export function useSaveDraft(props: SaveDraftProps) {
    const { debounceTimeout = 1000 } = props;

    const previousFormValuesRef = useRef<FormItems | null>(null);

    const baseQuestionnaireResponseFormProps = useContext(BaseQuestionnaireResponseFormPropsContext);

    const autoSave = baseQuestionnaireResponseFormProps?.autoSave;
    const setDraftSaveResponse = baseQuestionnaireResponseFormProps?.setDraftSaveResponse;
    const formData = baseQuestionnaireResponseFormProps?.formData;
    const questionnaireId = formData?.context.questionnaire.assembledFrom;
    const submitting = baseQuestionnaireResponseFormProps?.submitting;

    const saveDraft = async (currentFormValues: FormItems) => {
        if (!questionnaireId || !formData) {
            return;
        }

        if (!_.isEqual(currentFormValues, previousFormValuesRef.current) && setDraftSaveResponse) {
            setDraftSaveResponse(loading);
            setDraftSaveResponse(await saveQuestionnaireResponseDraft(questionnaireId, formData, currentFormValues));
            previousFormValuesRef.current = _.cloneDeep(currentFormValues);
        }
    };

    const debouncedSaveDraft = _.debounce(async (currentFormValues: FormItems) => {
        if (!autoSave || !questionnaireId) return;

        saveDraft({ currentFormValues });
    }, debounceTimeout);

    return {
        saveDraft,
        debouncedSaveDraft,
        autoSave,
        setDraftSaveResponse,
        questionnaireId,
        formData,
        submitting,
    };
}
