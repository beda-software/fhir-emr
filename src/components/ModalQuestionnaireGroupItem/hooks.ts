import _ from 'lodash';
import { useContext, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { questionnaireItemsToValidationSchema } from '@beda.software/fhir-questionnaire/components';
import { BaseQuestionnaireResponseFormPropsContext } from '@beda.software/fhir-questionnaire/contexts';

import { ModalQuestionnaireItemProps } from './types';

export function useModalQuestionnaireGroupItem(props: ModalQuestionnaireItemProps) {
    const { index, groupItem, title, handleSave } = props;
    const { questionItem, parentPath, context } = groupItem;
    const { item, linkId } = questionItem;

    const fieldName = useMemo(
        () => [...parentPath, linkId, 'items', ...(index !== undefined ? [index.toString()] : [])],
        [parentPath, linkId, index],
    );
    const { trigger, getValues } = useFormContext() ?? {
        trigger: undefined,
        formState: { isSubmitted: false },
    };
    const baseQRFPropsContext = useContext(BaseQuestionnaireResponseFormPropsContext);

    if (index === undefined) {
        return null;
    }

    const groupValues = _.get(getValues(), fieldName);

    const repeats = !!questionItem.repeats;

    const modalTitle = repeats ? `${title} ${index + 1}` : title;
    const modalParentPath = repeats
        ? [...parentPath, linkId, 'items', index.toString()]
        : [...parentPath, linkId, 'items'];

    const handleOk = async () => {
        await trigger?.();
        const hasError =
            questionnaireItemsToValidationSchema(item!, baseQRFPropsContext?.customYupTests).isValidSync(
                groupValues,
            ) === false;
        if (!hasError) {
            handleSave();
        }
    };

    return {
        modalTitle,
        modalParentPath,
        handleOk,
        itemContext: context[index],
    };
}
