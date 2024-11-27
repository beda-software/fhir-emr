import { DebouncedFunc } from 'lodash';
import { createContext } from 'react';
import { FormItems, ItemControlGroupItemComponentMapping, ItemControlQuestionItemComponentMapping } from 'sdc-qrf';

import { BaseQuestionnaireResponseFormProps } from '.';

export const ItemControlQuestionItemWidgetsContext = createContext<ItemControlQuestionItemComponentMapping>({});
export const ItemControlGroupItemWidgetsContext = createContext<ItemControlGroupItemComponentMapping>({});

interface BaseQuestionnaireResponseFormPropsContextProps extends BaseQuestionnaireResponseFormProps {
    submitting: boolean;
    debouncedSaveDraft?: DebouncedFunc<(currentFormValues: FormItems) => Promise<void>>;
}
export const BaseQuestionnaireResponseFormPropsContext = createContext<
    BaseQuestionnaireResponseFormPropsContextProps | undefined
>(undefined);
