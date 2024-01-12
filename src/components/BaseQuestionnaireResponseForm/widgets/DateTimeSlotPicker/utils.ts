import { Appointment, PractitionerRole, PractitionerRoleAvailableTime } from 'fhir/r4b';
import _ from 'lodash';
import moment from 'moment';

import { FHIRDateFormat, formatFHIRDateTime, parseFHIRDateTime } from '@beda.software/fhir-react';

import { days } from 'src/containers/Scheduling/available-time';

function praseSlotDuration(slotDuration: string) {
    const [hours, minutes, seconds] = slotDuration.split(':').map((v) => parseInt(v));

    return { hours, minutes, seconds };
}

function getPeriodTimeSlots(start: moment.Moment, end: moment.Moment, slotDuration: string) {
    const startTime = start;
    const endTime = end;
    const timeStops = [];
    const { hours, minutes, seconds } = praseSlotDuration(slotDuration);

    while (startTime.isBefore(endTime)) {
        timeStops.push(formatFHIRDateTime(startTime));
        startTime.add(hours, 'hours').add(minutes, 'minutes').add(seconds, 'seconds');
    }

    return timeStops;
}

export function getAllTimeSlots(availableTime: PractitionerRoleAvailableTime[], slotDuration: string) {
    // TODO: use number of weeks from settings or limited to maxDate
    const weeks = [0, 1, 2];
    const timeSlots: string[][] = [];

    availableTime.forEach((availableTime) => {
        const { daysOfWeek, availableStartTime, availableEndTime } = availableTime;

        if (!daysOfWeek?.[0] || !availableStartTime || !availableEndTime) {
            return;
        }

        const dayOfWeekNumber = days.indexOf(daysOfWeek[0]) + 1;

        weeks.forEach((w) => {
            const startTime = moment(availableStartTime, 'hh:mm:ss').day(dayOfWeekNumber).add(w, 'weeks');
            const endTime = moment(availableEndTime, 'hh:mm:ss').day(dayOfWeekNumber).add(w, 'weeks');

            const dateTimeSlots = getPeriodTimeSlots(startTime, endTime, slotDuration);

            timeSlots.push(dateTimeSlots);
        });
    });

    return timeSlots.flat();
}

function compareDates(date1: string, date2: string) {
    if (moment(date1).isBefore(moment(date2))) {
        return -1;
    } else if (moment(date1).isAfter(moment(date2))) {
        return 1;
    } else {
        return 0;
    }
}

export function groupAndSortTimeSlots(timeSlots: string[]): TimeSlots {
    return _.chain(timeSlots)
        .groupBy((t) => parseFHIRDateTime(t).format(FHIRDateFormat))
        .toPairs()
        .map(([date, timeSlots]) => ({ date, timeSlots }))
        .map(({ date, timeSlots }) => ({
            date,
            timeSlots: timeSlots.sort((date1, date2) => compareDates(date1, date2)),
        }))
        .value()
        .sort((g1, g2) => compareDates(g1.date, g2.date)) as TimeSlots;
}

export type TimeSlots = {
    date: string;
    timeSlots: [string, ...string[]];
}[];

export function getTimeSlots(practitionerRole: PractitionerRole, appointments: Appointment[], slotDuration: string) {
    const { availableTime } = practitionerRole;
    const timeSlots = availableTime ? getAllTimeSlots(availableTime, slotDuration) : [];
    const filteredBusySlots = filterBusyTimeSlots(timeSlots, appointments, slotDuration);
    const groupedTimeSlots = groupAndSortTimeSlots(filteredBusySlots);

    return groupedTimeSlots;
}

interface IntersectProps {
    timeSlotStart: moment.Moment;
    timeSlotEnd?: moment.Moment;
    appointmentStart?: moment.Moment;
    appointmentEnd?: moment.Moment;
}

function isPeriodsIntersect(props: IntersectProps) {
    const { timeSlotStart, timeSlotEnd, appointmentStart, appointmentEnd } = props;

    if (!appointmentStart) {
        return false;
    }

    if (timeSlotStart.isSameOrBefore(moment(), 'minutes')) {
        return true;
    }

    if (!appointmentEnd) {
        if (timeSlotStart.isSame(appointmentStart, 'minutes') || timeSlotEnd?.isSame(appointmentStart, 'minutes')) {
            return true;
        }
    }

    if (
        timeSlotStart.isBetween(appointmentStart, appointmentEnd, 'minutes') ||
        timeSlotEnd?.isBetween(appointmentStart, appointmentEnd, 'minutes')
    ) {
        return true;
    }

    return false;
}

export function filterBusyTimeSlots(timeSlots: string[], appointments: Appointment[], slotDuration: string) {
    const { hours, minutes, seconds } = praseSlotDuration(slotDuration);

    return timeSlots.filter((timeSlot) => {
        const intersectArray = appointments.map((appointment) => {
            return isPeriodsIntersect({
                timeSlotStart: parseFHIRDateTime(timeSlot),
                timeSlotEnd: parseFHIRDateTime(timeSlot)
                    .add(hours, 'hours')
                    .add(minutes, 'minutes')
                    .add(seconds, 'seconds'),
                appointmentStart: appointment.start ? parseFHIRDateTime(appointment.start) : undefined,
                appointmentEnd: appointment.end ? parseFHIRDateTime(appointment.end) : undefined,
            });
        });

        return _.every(intersectArray, (v) => v === false);
    });
}

export const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
