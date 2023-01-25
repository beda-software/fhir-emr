import React from 'react';

import { days, DaySchedule, DaySchedules, ScheduleBreak } from './available-time';

export function useUsualSchedule(initialSchedulesByDay: DaySchedules) {
  const [schedulesByDay, setSchedulesByDay] = React.useState<DaySchedules>(initialSchedulesByDay);
  const setScheduleByDay = (day: string, fn: (schedule: DaySchedule) => DaySchedule) => {
    setSchedulesByDay((schedules) => {
      const schedule = schedules[day] || {};

      return {
        ...schedules,
        [day]: fn(schedule),
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
      const newSchedules = Object.assign({}, schedules);

      delete newSchedules[day];

      return newSchedules;
    });
  };
  const changeScheduleStart = (day: string, value: string | undefined) => {
    setScheduleByDay(day, (schedule) => ({ ...schedule, start: value }));
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

  return {
    days,
    schedulesByDay,
    addBreak,
    removeBreak,
    toggleSchedule,
    changeScheduleStart,
    changeScheduleEnd,
    changeBreakStart,
    changeBreakEnd,
  };
}
