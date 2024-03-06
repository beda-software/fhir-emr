import { createContext } from 'react';
import { ItemControlGroupItemComponentMapping, ItemControlQuestionItemComponentMapping } from 'sdc-qrf';

export const ItemControlQuestionItemWidgetsContext = createContext<ItemControlQuestionItemComponentMapping>({});
export const ItemControlGroupItemWidgetsContext = createContext<ItemControlGroupItemComponentMapping>({});
