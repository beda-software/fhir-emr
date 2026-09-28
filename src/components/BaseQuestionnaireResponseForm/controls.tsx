import {
    GroupItemComponent,
    ItemControlGroupItemComponentMapping,
    ItemControlQuestionItemComponentMapping,
    QuestionItemComponentMapping,
} from 'sdc-qrf';

import {
    groupItemComponent as defaultGroupComponent,
    questionItemComponents as defaultItemComponents,
    itemControlQuestionItemComponents as defaultItemControlComponents,
    itemControlGroupItemComponents as defaultGroupControlComponents,
} from '@beda.software/web-item-controls/controls';
import {
    AnxietyScore,
    DepressionScore,
    MarkdownCard,
    MarkdownDisplay,
} from '@beda.software/web-item-controls/readonly-controls';

import { GroupVoice } from './widgets/GroupVoice';

export const itemComponents: QuestionItemComponentMapping = {
    ...defaultItemComponents,
};

export const groupComponent: GroupItemComponent = defaultGroupComponent;

export const itemControlComponents: ItemControlQuestionItemComponentMapping = {
    ...defaultItemControlComponents,
    markdown: MarkdownDisplay,
    'markdown-card': MarkdownCard,
    'anxiety-score': AnxietyScore,
    'depression-score': DepressionScore,
};

export const groupControlComponents: ItemControlGroupItemComponentMapping = {
    ...defaultGroupControlComponents,
    'group-voice': GroupVoice,
};
