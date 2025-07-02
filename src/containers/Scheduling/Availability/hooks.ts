import { PractitionerRole } from 'fhir/r4b';
import _ from 'lodash';
import React, { useCallback, useMemo } from 'react';

import { days, DaySchedule, DaySchedules, fromAvailableTime, ScheduleBreak } from '../available-time';

interface Props {
    practitionerRole: PractitionerRole;
}

export function useAvailability({ practitionerRole }: Props) {
    const initialSchedule = useMemo(() => fromAvailableTime(practitionerRole.availableTime || []), [practitionerRole]);
    const [schedule, setSchedulesByDay] = React.useState<DaySchedules>(initialSchedule);
    const scheduleHasChanges = useMemo(() => !_.isEqual(initialSchedule, schedule), [initialSchedule, schedule]);
    const setScheduleByDay = (day: string, fn: (schedule: DaySchedule) => DaySchedule) => {
        setSchedulesByDay((schedules) => {
            const schedule = schedules[day];

            return {
                ...schedules,
                ...(schedule ? { [day]: fn(schedule) } : {}),
            };
        });
    };
    const setBreaksByDay = (day: string, fn: (breaks: ScheduleBreak[]) => ScheduleBreak[]) => {
        setScheduleByDay(day, (schedule) => ({
            ...schedule,
            breaks: fn(schedule.breaks || []),
        }));
    };
    const addBreak = (day: string) => {
        setBreaksByDay(day, (breaks) => [...breaks, {}]);
    };

    const removeBreak = (day: string, index: number) => {
        setBreaksByDay(day, (breaks) =>
            breaks.map((currentBreak, currentBreakIndex) =>
                currentBreakIndex === index ? { ...currentBreak, removed: true } : currentBreak,
            ),
        );
    };

    const toggleSchedule = (day: string) => {
        setSchedulesByDay((schedules) => {
            const newSchedules = {
                [day]: {
                    start: '08:00:00',
                    end: '17:00:00',
                    breaks: [],
                },
                ...schedules,
            };
            if (schedules[day]) {
                delete newSchedules[day];
            }
            return newSchedules;
        });
    };

    const changeScheduleStart = (day: string, value: string | undefined) => {
        setScheduleByDay(day, (schedule) => {
            return { ...schedule, start: value };
        });
    };
    const changeScheduleEnd = (day: string, value: string | undefined) => {
        setScheduleByDay(day, (schedule) => ({ ...schedule, end: value }));
    };
    const setBreakByDay = (day: string, index: number, fn: (b: ScheduleBreak) => ScheduleBreak) => {
        setBreaksByDay(day, (breaks) =>
            breaks.map((currentBreak, currentBreakIndex) =>
                currentBreakIndex === index ? fn(currentBreak) : currentBreak,
            ),
        );
    };

    const changeBreakStart = (day: string, index: number, value: string | undefined) => {
        setBreakByDay(day, index, (currentBreak) => ({ ...currentBreak, start: value }));
    };

    const changeBreakEnd = (day: string, index: number, value: string | undefined) => {
        setBreakByDay(day, index, (currentBreak) => ({ ...currentBreak, end: value }));
    };

    const reset = useCallback(() => {
        setSchedulesByDay(initialSchedule);
    }, [initialSchedule]);

    return {
        days,
        schedule,
        addBreak,
        removeBreak,
        toggleSchedule,
        changeScheduleStart,
        changeScheduleEnd,
        changeBreakStart,
        changeBreakEnd,
        reset,
        scheduleHasChanges,
    };
}
