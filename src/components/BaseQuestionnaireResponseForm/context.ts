import { createContext } from 'react';
import { ItemControlGroupItemComponentMapping, ItemControlQuestionItemComponentMapping } from 'sdc-qrf';

export { BaseQuestionnaireResponseFormPropsContext } from '@beda.software/fhir-questionnaire/contexts';

export const ItemControlQuestionItemWidgetsContext = createContext<ItemControlQuestionItemComponentMapping>({});
export const ItemControlGroupItemWidgetsContext = createContext<ItemControlGroupItemComponentMapping>({});

export const ItemControlQuestionItemReadonlyWidgetsContext = createContext<ItemControlQuestionItemComponentMapping>({});
export const ItemControlGroupItemReadonlyWidgetsContext = createContext<ItemControlGroupItemComponentMapping>({});
