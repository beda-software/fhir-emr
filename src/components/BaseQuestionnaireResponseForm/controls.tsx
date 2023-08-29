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
    Row,
    BloodPressure,
} from './widgets';
import { Display } from './widgets/display';
import { QuestionReference } from './widgets/reference';
import { TextWithMacroFill } from '../TextWithMacroFill';

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
};

export const groupComponent: GroupItemComponent = Group;

export const itemControlComponents: ItemControlQuestionItemComponentMapping = {
    phoneWidget: QuestionPhone,
    slider: QuestionSlider,
    'solid-radio-button': QuestionSolidRadio,
    'inline-choice': InlineChoice,
    'text-with-macro': TextWithMacroFill,
};

export const groupControlComponents: ItemControlGroupItemComponentMapping = {
    col: Col,
    row: Row,
    'blood-pressure': BloodPressure,
    'time-range-picker': TimeRangePickerControl,
};
