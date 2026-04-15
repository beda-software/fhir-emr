import classNames from 'classnames';
import _ from 'lodash';
import { GroupItemProps } from 'sdc-qrf';

import { useTimeRangePickerControl } from '@beda.software/web-item-controls/controls';

import { getDisplay } from 'src/utils/questionnaire';

import s from './ReadonlyWidgets.module.scss';
import { S } from './ReadonlyWidgets.styles';

export function TimeRangePickerControl(props: GroupItemProps) {
    const { questionItem } = props;

    if (questionItem.item?.length !== 2) {
        return <S.Question>Time range picker require exactly two children</S.Question>;
    }

    return <TimeRangePickerWidget {...props} />;
}

function TimeRangePickerWidget(props: GroupItemProps) {
    const { questionItem } = props;
    const { text } = questionItem;

    const { startTimeFieldValue, endTimeFieldValue } = useTimeRangePickerControl(props);
    const display = _.compact([getDisplay(startTimeFieldValue?.value), getDisplay(endTimeFieldValue?.value)]).join('–');

    return (
        <S.Question className={classNames(s.question, s.row, 'form__question')}>
            <span className={s.questionText}>{text}</span>
            <span className={s.answer}>{display || '-'}</span>
        </S.Question>
    );
}
