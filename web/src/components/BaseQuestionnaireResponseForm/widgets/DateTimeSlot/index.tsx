import { Form, Radio, Space } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { QuestionItemProps } from 'sdc-qrf';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';
import { useService } from 'aidbox-react/lib/hooks/service';
import {
    extractBundleResources,
    getAllFHIRResources,
    getFHIRResource,
} from 'aidbox-react/lib/services/fhir';
import { mapSuccess, resolveMap } from 'aidbox-react/lib/services/service';
import { formatFHIRDateTime } from 'aidbox-react/lib/utils/date';

import { AidboxReference, Appointment, PractitionerRole } from 'shared/src/contrib/aidbox';
import { humanDate } from 'shared/src/utils/date';

import { Spinner } from 'src/components/Spinner';
import { useCalendarOptions } from 'src/containers/Scheduling/ScheduleCalendar/hooks/useCalendarOptions';

import { useFieldController } from '../../hooks';
import s from './DateTimeSlot.module.scss';
import { dayNames, getTimeSlots } from './utils';

interface Props extends QuestionItemProps {
    practitionerRolePath: Array<string | number>;
}

function useDateTimeSlotControl(practitionerRole: AidboxReference<PractitionerRole>) {
    const { calendarOptions } = useCalendarOptions();
    const { slotDuration } = calendarOptions;

    const [response] = useService(
        async () =>
            mapSuccess(
                await resolveMap({
                    practitionerRole: getFHIRResource<PractitionerRole>(practitionerRole),
                    appointmentsBundle: getAllFHIRResources<Appointment>('Appointment', {
                        actor: practitionerRole.id,
                        date: [`ge${formatFHIRDateTime(moment().startOf('day'))}`],
                    }),
                }),
                ({ practitionerRole, appointmentsBundle }) => {
                    const appointments = extractBundleResources(appointmentsBundle).Appointment;

                    return {
                        groupedTimeSlots: getTimeSlots(
                            practitionerRole,
                            appointments,
                            slotDuration,
                        ),
                    };
                },
            ),
        [practitionerRole.id],
    );

    return { response };
}

function usePractitionerRoleId(practitionerRolePath: Array<string | number>) {
    const [prId, setPRId] = useState(undefined);

    const { watch } = useFormContext();
    const newPRId = _.get(watch(), [...practitionerRolePath, 'id']);

    useEffect(() => {
        if (prId !== newPRId) {
            setPRId(newPRId);
        }
    }, [newPRId, prId]);

    return prId;
}

export function DateTimeSlot(props: Props) {
    const { questionItem } = props;
    const { text, hidden } = questionItem;
    const prId = usePractitionerRoleId(props.practitionerRolePath);

    return (
        <Form.Item label={text} hidden={hidden}>
            {prId ? (
                <DateTimeSlotControl
                    {...props}
                    practitionerRole={{
                        resourceType: 'PractitionerRole',
                        id: prId,
                    }}
                />
            ) : null}
        </Form.Item>
    );
}

function DateTimeSlotControl(
    props: Props & { practitionerRole: AidboxReference<PractitionerRole> },
) {
    const { questionItem, parentPath, practitionerRole } = props;
    const { linkId } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'dateTime'];
    const { value, onChange, disabled } = useFieldController(fieldName, questionItem);
    const { response } = useDateTimeSlotControl(practitionerRole);

    return (
        <RenderRemoteData remoteData={response} renderLoading={Spinner}>
            {({ groupedTimeSlots }) => (
                <Space direction="vertical">
                    {groupedTimeSlots.length === 0 ? 'No available time slots' : null}
                    {groupedTimeSlots.map(({ date, timeSlots }) => (
                        <div key={`groupedTimeSlots-${date}`}>
                            <b>
                                {moment(date).format(humanDate)}, {dayNames[moment(date).day()]}
                            </b>
                            <div className={s.timeSlots}>
                                {timeSlots.map((timeSlot) => (
                                    <Radio
                                        key={`groupedTimeSlots-${timeSlot}`}
                                        checked={value === timeSlot}
                                        disabled={disabled}
                                        onChange={() => onChange(timeSlot)}
                                        className={s.timeSlot}
                                    >
                                        {moment(timeSlot).format('hh:mm a')}
                                    </Radio>
                                ))}
                            </div>
                        </div>
                    ))}
                </Space>
            )}
        </RenderRemoteData>
    );
}
