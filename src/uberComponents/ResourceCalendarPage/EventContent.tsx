import { EventContentArg } from '@fullcalendar/core';

import { S } from './styles';

function eventDateStr(eventStart?: string, eventEnd?: string): string {
    const formatTime = (dateStr?: string) => {
        if (!dateStr) {
            return null;
        }
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
        <S.Container>
            <S.TextBlock>
                <S.Title>{eventContent.event.title}</S.Title>
                <S.Timebox>{eventDate}</S.Timebox>
            </S.TextBlock>
        </S.Container>
    );
}
