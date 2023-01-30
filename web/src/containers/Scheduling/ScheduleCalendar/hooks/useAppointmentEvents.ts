import { DateSelectArg, EventChangeArg, EventClickArg } from '@fullcalendar/core';
import { notification } from 'antd';
import { useState } from 'react';

import { isSuccess } from 'aidbox-react/lib/libs/remoteData';
import { getReference, patchFHIRResource, saveFHIRResource } from 'aidbox-react/lib/services/fhir';
import { formatError } from 'aidbox-react/lib/utils/error';

import {
    Appointment,
    CodeableConcept,
    InternalReference,
    // Location,
    Patient,
    PractitionerRole,
} from 'shared/src/contrib/aidbox/index';
import { formatFHIRDateTime } from 'shared/src/utils/date';

interface EditModalData {
    clickedAppointmentId: string;
    showEditAppointmentModal: boolean;
}

interface NewModalData {
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

    function handleEventChange({ event }: EventChangeArg) {
        // TODO: show confirm modal and discard event change if rejected
        const { id, start, end } = event;
        updateAppointment({
            id,
            start: formatFHIRDateTime(start!),
            end: formatFHIRDateTime(end!),
        }).then();
    }

    function handleEventClick(e: EventClickArg) {
        setEditModalData({ clickedAppointmentId: e.event.id, showEditAppointmentModal: true });
    }

    function handleGridSelect({ start, end }: DateSelectArg) {
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

    // TODO: support update patient, practitioner, service for Appointment
    async function updateAppointment({
        id,
        start,
        end,
    }: Required<Pick<Appointment, 'id' | 'start' | 'end'>>) {
        const response = await patchFHIRResource<Appointment>({
            resourceType: 'Appointment',
            id,
            start,
            end,
        });
        if (isSuccess(response)) {
            notification.success({ message: 'Successfully updated' });
        } else {
            notification.error({ message: formatError(response.error) });
        }
    }

    return {
        handleEventChange,
        handleEventClick,
        handleGridSelect,
        editModalData,
        setEditModalData,
        newModalData,
        handleOkNewAppointment,
        handleCancelNewAppointment,
    };
}
