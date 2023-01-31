import { DateSelectArg, EventClickArg } from '@fullcalendar/core';
import { useState } from 'react';

import { PractitionerRole } from 'shared/src/contrib/aidbox/index';

interface EditModalData {
    clickedAppointmentId: string;
    showEditAppointmentModal: boolean;
}

export interface NewModalData {
    appointmentDate: {
        start: Date | null;
        end: Date | null;
    };
    showNewAppointmentModal: boolean;
}

export function useAppointmentEvents(practitionerRole: PractitionerRole) {
    const [editModalData, setEditModalData] = useState<EditModalData>({
        clickedAppointmentId: 'undefined',
        showEditAppointmentModal: false,
    });

    const [newModalData, setNewModalData] = useState<NewModalData>({
        appointmentDate: {
            start: null,
            end: null,
        },
        showNewAppointmentModal: false,
    });

    // function handleEventChange({ event }: EventChangeArg) {
    //     // TODO: show confirm modal and discard event change if rejected
    //     const { id, start, end } = event;
    // }

    function handleEventClick(e: EventClickArg) {
        console.log('handleEventClick');

        setEditModalData({ clickedAppointmentId: e.event.id, showEditAppointmentModal: true });
    }

    function handleGridSelect({ start, end }: DateSelectArg) {
        console.log('handleGridSelect');

        setNewModalData({
            appointmentDate: {
                start,
                end,
            },
            showNewAppointmentModal: true,
        });
    }

    function handleOkNewAppointment() {
        setNewModalData((state) => ({
            ...state,
            showNewAppointmentModal: false,
        }));
    }

    async function handleCancelNewAppointment() {
        setNewModalData((data) => ({
            ...data,
            showNewAppointmentModal: false,
        }));
    }

    return {
        handleEventClick,
        handleGridSelect,
        editModalData,
        setEditModalData,
        newModalData,
        handleOkNewAppointment,
        handleCancelNewAppointment,
    };
}
