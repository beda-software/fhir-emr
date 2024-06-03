import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react'; // import it first
import timeGridPlugin from '@fullcalendar/timegrid';
import { t } from '@lingui/macro';

import { S } from './Calendar.styles';
import { useCalendarOptions } from './useCalendarOptions';

export function Calendar(options: CalendarOptions) {
    const { calendarOptions } = useCalendarOptions();

    return (
        <S.Calendar>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                nowIndicator={true}
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'timeGridWeek,timeGridDay',
                }}
                initialView="timeGridWeek"
                editable={true}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                buttonText={{
                    today: t`Today`,
                    week: t`Week`,
                    day: t`Day`,
                }}
                dayHeaderFormat={{
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                }}
                stickyHeaderDates={true}
                allDaySlot={false}
                contentHeight={650}
                slotLabelFormat={{
                    timeStyle: 'short',
                }}
                {...calendarOptions}
                {...options}
            />
        </S.Calendar>
    );
}
