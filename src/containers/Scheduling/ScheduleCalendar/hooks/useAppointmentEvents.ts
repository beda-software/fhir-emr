import { DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core';
import { useCallback, useState } from 'react';

export interface NewAppointmentData {
    start: Date;
    end: Date;
}

export function useAppointmentEvents() {
    const [newAppointmentData, setNewAppointmentData] = useState<NewAppointmentData | undefined>();
    const [appointmentDetails, setAppointmentDetails] = useState<EventApi | undefined>();
    const [editingAppointmentId, setEditingAppointmentId] = useState<string | undefined>();

    const openNewAppointmentModal = useCallback(({ start, end }: DateSelectArg) => {
        setNewAppointmentData({
            start,
            end,
        });
    }, []);
    const closeNewAppointmentModal = useCallback(() => {
        setNewAppointmentData(undefined);
    }, []);

    const openAppointmentDetails = useCallback((e: EventClickArg) => {
        setAppointmentDetails(e.event);
    }, []);
    const closeAppointmentDetails = useCallback(() => {
        setAppointmentDetails(undefined);
    }, []);

    const openEditAppointment = useCallback((id: string) => {
        setEditingAppointmentId(id);
    }, []);
    const closeEditAppointment = useCallback(() => {
        setEditingAppointmentId(undefined);
    }, []);

    return {
        openNewAppointmentModal,
        newAppointmentData,
        closeNewAppointmentModal,

        openAppointmentDetails,
        appointmentDetails,
        closeAppointmentDetails,

        openEditAppointment,
        editingAppointmentId,
        closeEditAppointment,
    };
}
