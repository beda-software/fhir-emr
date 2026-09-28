import {
    GroupItemComponent,
    ItemControlGroupItemComponentMapping,
    ItemControlQuestionItemComponentMapping,
    QuestionItemComponentMapping,
} from 'sdc-qrf';

import { Barcode } from '@beda.software/web-item-controls/controls';
import {
    questionItemComponents as defaultItemComponents,
    groupItemComponent as defaultGroupComponent,
    itemControlQuestionItemComponents as defaultItemControlComponents,
    itemControlGroupItemComponents as defaultGroupControlComponents,
    MarkdownRenderControl,
} from '@beda.software/web-item-controls/readonly-controls';

export const itemComponents: QuestionItemComponentMapping = {
    ...defaultItemComponents,
};

export const groupComponent: GroupItemComponent = defaultGroupComponent;

export const itemControlComponents: ItemControlQuestionItemComponentMapping = {
    ...defaultItemControlComponents,
    barcode: Barcode,
    'markdown-editor': MarkdownRenderControl,
};

export const groupControlComponents: ItemControlGroupItemComponentMapping = {
    ...defaultGroupControlComponents,
};
