import { CalendarOptions } from '@fullcalendar/common';
import React from 'react';

export function useCalendarOptions() {
    // TODO: use settings page and form to change calendar settings
    const [calendarOptions, setCalendarOptions] = React.useState<CalendarOptions>({
        weekends: true,
        slotDuration: '00:15:00',
        slotMinTime: '06:00:00',
        slotMaxTime: '20:00:00',
    });
    return { calendarOptions, setCalendarOptions };
}
