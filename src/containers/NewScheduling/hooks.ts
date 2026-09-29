import { Appointment, Slot } from 'fhir/r4b';
import { useTheme } from 'styled-components';

import { ResourceCalendarPageProps } from 'src/uberComponents/ResourceCalendarPage/types';
import { questionnaireAction } from 'src/uberComponents/ResourceListPage/actions';
import { compileAsFirst } from 'src/utils';

export function useNewScheduling() {
    const theme = useTheme();
    const calendarColors = theme.calendar;

    const calendarQuestionnaireActions: ResourceCalendarPageProps<Appointment>['event']['actions'] = {
        show: questionnaireAction('Appointment details', 'edit-appointment-new'),
        create: questionnaireAction('New appointment', 'uber-calendar-appointment-new'),
        edit: questionnaireAction('Edit appointment', 'edit-appointment-new'),
    };

    const appointmentStartExpression = compileAsFirst<Appointment, string>('Appointment.start');
    const appointmentEndExpression = compileAsFirst<Appointment, string>('Appointment.end');
    const appointmentTitleExpression = compileAsFirst<Appointment, string>(
        "Appointment.participant.actor.where(reference.startsWith('Patient/')).first().display",
    );

    const eventData: ResourceCalendarPageProps<Appointment>['event'] = {
        actions: calendarQuestionnaireActions,
        data: {
            startExpression: (ctx) => appointmentStartExpression(ctx.resource) ?? 'Undefined',
            endExpression: (ctx) => appointmentEndExpression(ctx.resource) ?? 'Undefined',
            titleExpression: (ctx) => appointmentTitleExpression(ctx.resource) ?? 'Undefined',
        },
        eventColorMapping: {
            targetExpression: compileAsFirst<Appointment, string>('Appointment.status'),
            colorMapping: {
                proposed: calendarColors['bg_slot-taken_default'],
                pending: calendarColors['bg_slot-taken_orange'],
                booked: calendarColors['bg_slot-taken_cyan'],
                arrived: calendarColors['bg_slot-taken_magenta'],
                fulfilled: calendarColors['bg_slot-taken_purple'],
                cancelled: calendarColors['bg_slot-taken_default'],
                waitlist: calendarColors['bg_slot-taken_orange'],
            },
        },
        searchParamsMapping: {
            actor: 'actor',
            'service-type': 'actor',
            calendarStart: 'date',
        },
    };

    const slotData: ResourceCalendarPageProps<Appointment>['slot'] = {
        eventColorMapping: {
            targetExpression: compileAsFirst<Slot, string>('Slot.status'),
            colorMapping: {
                busy: calendarColors['bg_slot-taken_cyan'],
                free: calendarColors['bg_slot-taken_default'],
                'busy-unavailable': calendarColors['bg_slot-taken_purple'],
                'busy-tentative': calendarColors['bg_slot-taken_orange'],
                'entered-in-error': calendarColors['bg_slot-taken_default'],
            },
        },
        searchParamsMapping: {
            calendarStart: 'start',
        },
    };

    return { eventData, slotData };
}
