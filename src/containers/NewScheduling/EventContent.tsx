import { EventContentArg } from '@fullcalendar/core';

export function EventContent(eventContent: EventContentArg) {
    const status = eventContent.event.extendedProps.status;

    return (
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {eventContent.event.title}
            </div>
            {status === 'booked' && <div>{eventContent.timeText}</div>}
            {status !== 'booked' && <div>{status}</div>}
        </div>
    );
}
