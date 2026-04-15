import {
    GroupItemComponent,
    ItemControlGroupItemComponentMapping,
    ItemControlQuestionItemComponentMapping,
    QuestionItemComponentMapping,
} from 'sdc-qrf';

import { Barcode } from '@beda.software/web-item-controls/controls';

import { AudioAttachment } from './readonly-widgets/AudioAttachment';
import { QuestionBoolean } from './readonly-widgets/boolean';
import { QuestionChoice } from './readonly-widgets/choice';
import { QuestionDateTime } from './readonly-widgets/date';
import { Display } from './readonly-widgets/display';
import { Col, Group, Row } from './readonly-widgets/Group';
import { NavigationGroup } from './readonly-widgets/Group/NavigationGroup';
import { GroupWizardVertical } from './readonly-widgets/GroupWizard';
import { MarkdownCard, MarkdownDisplay, MarkdownRenderControl } from './readonly-widgets/MarkdownRender';
import { QuestionDecimal, QuestionInteger, QuestionQuantity } from './readonly-widgets/number';
import { QuestionReference } from './readonly-widgets/reference';
import { AnxietyScore, DepressionScore } from './readonly-widgets/score';
import { QuestionText, TextWithInput } from './readonly-widgets/string';
import { TimeRangePickerControl } from './readonly-widgets/TimeRangePickerControl';
import { UploadFile } from './readonly-widgets/UploadFile';

export const itemComponents: QuestionItemComponentMapping = {
    text: QuestionText,
    time: QuestionDateTime,
    string: QuestionText,
    integer: QuestionInteger,
    decimal: QuestionDecimal,
    quantity: QuestionQuantity,
    choice: QuestionChoice,
    date: QuestionDateTime,
    dateTime: QuestionDateTime,
    reference: QuestionReference,
    display: Display,
    boolean: QuestionBoolean,
    attachment: UploadFile,
};

export const groupComponent: GroupItemComponent = Group;

export const itemControlComponents: ItemControlQuestionItemComponentMapping = {
    'inline-choice': QuestionChoice,
    'anxiety-score': AnxietyScore,
    'depression-score': DepressionScore,
    'input-inside-text': TextWithInput,
    'audio-recorder-uploader': AudioAttachment,
    barcode: Barcode,
    markdown: MarkdownDisplay,
    'markdown-card': MarkdownCard,
    'markdown-editor': MarkdownRenderControl,
};

export const groupControlComponents: ItemControlGroupItemComponentMapping = {
    col: Col,
    row: Row,
    'time-range-picker': TimeRangePickerControl,
    'wizard-navigation-group': NavigationGroup,
    'wizard-vertical': GroupWizardVertical,
};
