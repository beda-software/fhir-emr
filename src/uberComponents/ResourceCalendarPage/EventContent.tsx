import { EventContentArg } from '@fullcalendar/core';

function eventDateStr(eventStart?: string, eventEnd?: string): string {
    const formatTime = (dateStr?: string) => {
        if (!dateStr) return null;
        const date = new Date(dateStr);
        return isNaN(date.getTime()) ? null : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const startFormatted = formatTime(eventStart);
    const endFormatted = formatTime(eventEnd);

    return [startFormatted, endFormatted].filter(Boolean).join(' - ');
}

export function EventContent(eventContent: EventContentArg) {
    const eventDate = eventDateStr(
        eventContent.event.extendedProps.eventStart,
        eventContent.event.extendedProps.eventEnd,
    );

    return (
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {eventContent.event.title}
            </div>
            <div>{eventDate}</div>
        </div>
    );
}
