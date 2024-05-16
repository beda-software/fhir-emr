import { CalendarOptions as FullCalendarCalendarOptions } from '@fullcalendar/core';
import React from 'react';

import { formatFHIRDate } from '@beda.software/fhir-react';

interface CalendarOptions extends FullCalendarCalendarOptions {
    slotDuration: string;
}

export function useCalendarOptions() {
    // TODO: use settings page and form to change calendar settings
    const [calendarOptions, setCalendarOptions] = React.useState<CalendarOptions>({
        weekends: true,
        slotDuration: '00:15:00',
        slotMinTime: '06:00:00',
        slotMaxTime: '20:00:00',
        initialDate: formatFHIRDate(new Date()),
    });
    return { calendarOptions, setCalendarOptions };
}
