import { Form } from 'antd';
import { Reference, Appointment, PractitionerRole } from 'fhir/r4b';
import _ from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { QuestionItemProps } from 'sdc-qrf';

import {
    RenderRemoteData,
    extractBundleResources,
    formatFHIRDate,
    formatFHIRDateTime,
    parseFHIRDateTime,
    useService,
} from '@beda.software/fhir-react';
import { mapSuccess, resolveMap } from '@beda.software/remote-data';

import { useCalendarOptions } from 'src/components/Calendar/useCalendarOptions';
import { DatePicker } from 'src/components/DatePicker';
import { Spinner } from 'src/components/Spinner';
import { getAllFHIRResources, getFHIRResource } from 'src/services/fhir';
import { humanDateTime } from 'src/utils/date';

import { TimeSlots, getTimeSlots } from './utils';
import { useFieldController } from '../../hooks';

interface AvailableDatePickerProps extends QuestionItemProps {
    practitionerRolePath: Array<string | number>;
}

function useDateTimeSlots(practitionerRoleRef: Reference) {
    const { calendarOptions } = useCalendarOptions();
    const { slotDuration } = calendarOptions;

    const [response] = useService(
        async () =>
            mapSuccess(
                await resolveMap({
                    practitionerRole: getFHIRResource<PractitionerRole>(practitionerRoleRef),
                    appointmentsBundle: getAllFHIRResources<Appointment>('Appointment', {
                        actor: practitionerRoleRef.reference,
                        date: [`ge${formatFHIRDateTime(moment().startOf('day'))}`],
                    }),
                }),
                ({ practitionerRole, appointmentsBundle }) => {
                    const appointments = extractBundleResources(appointmentsBundle).Appointment;

                    return {
                        timeSlots: getTimeSlots(practitionerRole, appointments, slotDuration),
                    };
                },
            ),
        [practitionerRoleRef.reference],
    );

    return { response };
}

export function usePractitionerRoleId(practitionerRolePath: Array<string | number>) {
    const [prId, setPRId] = useState<string | undefined>(undefined);
    const { watch } = useFormContext();

    // const newPRId = parseFHIRReference(_.get(watch(), [...practitionerRolePath])).id;
    const newPRId = _.get(watch(), [...practitionerRolePath])?.id;

    useEffect(() => {
        if (prId !== newPRId) {
            setPRId(newPRId);
        }
    }, [newPRId, prId]);

    return prId;
}

export function DateTimeSlotPicker(props: AvailableDatePickerProps) {
    const { questionItem } = props;
    const { text, hidden } = questionItem;
    const prId = usePractitionerRoleId(props.practitionerRolePath);

    return (
        <Form.Item label={text} hidden={hidden}>
            {prId ? (
                <AvailableDateControl
                    {...props}
                    practitionerRole={{
                        reference: `PractitionerRole/${prId}`,
                    }}
                />
            ) : null}
        </Form.Item>
    );
}

function getDisabledTime(date: moment.Moment | null, timeSlots: TimeSlots) {
    const hoursRange = _.range(0, 24);
    const minutesRange = _.range(0, 60);

    if (!date) {
        return {
            disabledHours: () => hoursRange,
            disabledMinutes: () => minutesRange,
        };
    }

    const currentHour = date.hour();
    const enabledTimeSlots: string[] = timeSlots.filter((v) => v.date === formatFHIRDate(date))[0]?.timeSlots ?? [];

    const enabledHours = _.uniq(enabledTimeSlots.map((d) => parseFHIRDateTime(d).hour()));
    const disabledHours = hoursRange.filter((v) => !enabledHours.includes(v));

    const enabledMinutes = _.filter(enabledTimeSlots, (d) => parseFHIRDateTime(d).hour() === currentHour).map((d) =>
        parseFHIRDateTime(d).minute(),
    );
    const disabledMinutes = minutesRange.filter((v) => !enabledMinutes.includes(v));

    return {
        disabledHours: () => disabledHours,
        disabledMinutes: () => disabledMinutes,
    };
}

function AvailableDateControl(props: AvailableDatePickerProps & { practitionerRole: Reference }) {
    const { questionItem, parentPath, practitionerRole } = props;
    const { linkId } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'dateTime'];
    const { value, onChange, disabled } = useFieldController(fieldName, questionItem);
    const { response } = useDateTimeSlots(practitionerRole);

    const onDateChange = (date: moment.Moment | null, timeSlots: TimeSlots) => {
        const dateCanBeChoosen = date
            ? timeSlots
                  .filter((v) => v.date === formatFHIRDate(date))[0]
                  ?.timeSlots.filter((v) => v === formatFHIRDateTime(date))?.length
            : false;

        if (date && dateCanBeChoosen) {
            onChange(formatFHIRDateTime(date));

            return;
        }

        onChange(undefined);
    };

    return (
        <RenderRemoteData remoteData={response} renderLoading={Spinner}>
            {({ timeSlots }) => {
                const enabledDates = timeSlots.map((group) => group.date);

                return (
                    <DatePicker
                        showTime={true}
                        showNow={false}
                        showToday={false}
                        format={humanDateTime}
                        onChange={(date) => onDateChange(date, timeSlots)}
                        value={value ? parseFHIRDateTime(value) : undefined}
                        disabled={disabled}
                        disabledDate={(date) => !enabledDates.includes(formatFHIRDate(date))}
                        disabledTime={(date) => getDisabledTime(date, timeSlots)}
                        onBlur={(e) => {
                            const date = e.target.value ? moment(e.target.value, humanDateTime) : null;
                            onDateChange(date, timeSlots);
                        }}
                    />
                );
            }}
        </RenderRemoteData>
    );
}
