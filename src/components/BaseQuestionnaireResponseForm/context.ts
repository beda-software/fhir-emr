import { DebouncedFunc } from 'lodash';
import { createContext } from 'react';
import { FormItems, ItemControlGroupItemComponentMapping, ItemControlQuestionItemComponentMapping } from 'sdc-qrf';

import { BaseQuestionnaireResponseFormProps } from '.';

export const ItemControlQuestionItemWidgetsContext = createContext<ItemControlQuestionItemComponentMapping>({});
export const ItemControlGroupItemWidgetsContext = createContext<ItemControlGroupItemComponentMapping>({});

export const ItemControlQuestionItemReadonlyWidgetsContext = createContext<ItemControlQuestionItemComponentMapping>({});
export const ItemControlGroupItemReadonlyWidgetsContext = createContext<ItemControlGroupItemComponentMapping>({});

interface BaseQuestionnaireResponseFormPropsContextProps extends BaseQuestionnaireResponseFormProps {
    submitting: boolean;
    saveDraft?: (currentFormValues: FormItems) => Promise<void>;
    debouncedSaveDraft?: DebouncedFunc<(currentFormValues: FormItems) => Promise<void>>;
}
export const BaseQuestionnaireResponseFormPropsContext = createContext<
    BaseQuestionnaireResponseFormPropsContextProps | undefined
>(undefined);
