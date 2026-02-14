import {
    GroupItemComponent,
    ItemControlGroupItemComponentMapping,
    ItemControlQuestionItemComponentMapping,
    QuestionItemComponentMapping,
} from 'sdc-qrf';

import { GroupTable } from 'src/components/BaseQuestionnaireResponseForm/widgets/GroupTable';
import { TextWithMacroFill } from 'src/components/TextWithMacroFill';

import {
    BloodPressure,
    Col,
    Grid,
    Group,
    Gtable,
    InlineChoice,
    MDEditorControl,
    MainCard,
    QuestionBoolean,
    QuestionChoice,
    QuestionDateTime,
    QuestionDecimal,
    QuestionEmail,
    QuestionInputInsideText,
    QuestionInteger,
    QuestionPhone,
    QuestionQuantity,
    QuestionSlider,
    QuestionSolidRadio,
    QuestionString,
    QuestionText,
    Row,
    Section,
    SectionWithDivider,
    SubCard,
    TimeRangePickerControl,
} from './widgets';
import { AudioRecorderUploader } from './widgets/AudioRecorderUploader';
import { Barcode } from './widgets/barcode';
import { Display } from './widgets/display';
import { EditableGroup } from './widgets/EditableGroup';
import { GroupTabs } from './widgets/GroupTabs';
import { GroupWizard, GroupWizardVertical, GroupWizardWithTooltips } from './widgets/GroupWizard';
import { PasswordInput } from './widgets/PasswordInput';
import { QuestionReference } from './widgets/reference';
import { ReferenceRadioButton } from './widgets/ReferenceRadioButton';
import { UploadFileControl } from './widgets/UploadFileControl';

export const itemComponents: QuestionItemComponentMapping = {
    text: QuestionText,
    string: QuestionString,
    decimal: QuestionDecimal,
    integer: QuestionInteger,
    date: QuestionDateTime,
    dateTime: QuestionDateTime,
    time: QuestionDateTime,
    choice: QuestionChoice,
    'open-choice': QuestionChoice,
    boolean: QuestionBoolean,
    display: Display,
    reference: QuestionReference,
    quantity: QuestionQuantity,
    attachment: UploadFileControl,
};

export const groupComponent: GroupItemComponent = Group;

export const itemControlComponents: ItemControlQuestionItemComponentMapping = {
    phoneWidget: QuestionPhone,
    email: QuestionEmail,
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
    barcode: Barcode,
};

export const groupControlComponents: ItemControlGroupItemComponentMapping = {
    col: Col,
    row: Row,
    gtable: Gtable,
    table: Gtable,
    grid: Grid,
    section: Section,
    'section-with-divider': SectionWithDivider,
    'main-card': MainCard,
    'sub-card': SubCard,
    'blood-pressure': BloodPressure,
    'time-range-picker': TimeRangePickerControl,
    wizard: GroupWizard,
    'wizard-with-tooltips': GroupWizardWithTooltips,
    'wizard-navigation-group': GroupWizard,
    'wizard-vertical': GroupWizardVertical,
    'group-tabs': GroupTabs,
    'group-table': GroupTable,
    'editable-group': EditableGroup,
};
