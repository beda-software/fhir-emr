import classNames from 'classnames';
import _ from 'lodash';
import { GroupItemProps } from 'sdc-qrf';

import { getDisplay } from 'src/utils/questionnaire';

import { useTimeRangePickerControl } from '../widgets/TimeRangePickerControl/hooks';
import s from './ReadonlyWidgets.module.scss';

export function TimeRangePickerControl(props: GroupItemProps) {
    const { questionItem } = props;

    if (questionItem.item?.length !== 2) {
        return <p>Time range picker require exactly two children</p>;
    }

    return <TimeRangePickerWidget {...props} />;
}

function TimeRangePickerWidget(props: GroupItemProps) {
    const { questionItem } = props;
    const { text } = questionItem;

    const { startTimeFieldValue, endTimeFieldValue } = useTimeRangePickerControl(props);
    const display = _.compact([
        getDisplay(startTimeFieldValue.value),
        getDisplay(endTimeFieldValue.value),
    ]).join('–');

    return (
        <p className={classNames(s.question, s.row, 'form__question')}>
            <span className={s.questionText}>{text}</span>
            <span className={s.answer}>{display || '-'}</span>
        </p>
    );
}
