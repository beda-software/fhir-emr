import {
    GroupItemComponent,
    ItemControlGroupItemComponentMapping,
    ItemControlQuestionItemComponentMapping,
    QuestionItemComponentMapping,
} from 'sdc-qrf/lib/types';

import {
    Col,
    Group,
    InlineChoice,
    TimeRangePickerControl,
    QuestionBoolean,
    QuestionChoice,
    QuestionDateTime,
    QuestionDecimal,
    QuestionInteger,
    QuestionPhone,
    QuestionSlider,
    QuestionSolidRadio,
    QuestionString,
    QuestionText,
    QuestionInputInsideText,
    Row,
    BloodPressure,
    Gtable,
    QuestionQuantity,
    Grid,
    MDEditorControl,
} from './widgets';
import { Display } from './widgets/display';
import { GroupWizard, GroupWizardWithTooltips } from './widgets/GroupWizard';
import { PasswordInput } from './widgets/PasswordInput';
import { QuestionReference } from './widgets/reference';
import { ReferenceRadioButton } from './widgets/ReferenceRadioButton';
import { UploadFileControl } from './widgets/UploadFileControl';
import { TextWithMacroFill } from '../TextWithMacroFill';
import { AudioRecorderUploader } from './widgets/AudioRecorderUploader';

export const itemComponents: QuestionItemComponentMapping = {
    text: QuestionText,
    string: QuestionString,
    decimal: QuestionDecimal,
    integer: QuestionInteger,
    date: QuestionDateTime,
    dateTime: QuestionDateTime,
    time: QuestionDateTime,
    choice: QuestionChoice,
    boolean: QuestionBoolean,
    display: Display,
    reference: QuestionReference,
    quantity: QuestionQuantity,
    attachment: UploadFileControl,
};

export const groupComponent: GroupItemComponent = Group;

export const itemControlComponents: ItemControlQuestionItemComponentMapping = {
    phoneWidget: QuestionPhone,
    passwordWidget: PasswordInput,
    slider: QuestionSlider,
    'solid-radio-button': QuestionSolidRadio,
    'inline-choice': InlineChoice,
    'text-with-macro': TextWithMacroFill,
    'radio-button': InlineChoice,
    'reference-radio-button': ReferenceRadioButton,
    'check-box': InlineChoice,
    'input-inside-text': QuestionInputInsideText,
    'markdown-editor': MDEditorControl,
    'audio-recorder-uploader': AudioRecorderUploader,
};

export const groupControlComponents: ItemControlGroupItemComponentMapping = {
    col: Col,
    row: Row,
    gtable: Gtable,
    table: Gtable,
    grid: Grid,
    'blood-pressure': BloodPressure,
    'time-range-picker': TimeRangePickerControl,
    wizard: GroupWizard,
    'wizard-with-tooltips': GroupWizardWithTooltips,
};
