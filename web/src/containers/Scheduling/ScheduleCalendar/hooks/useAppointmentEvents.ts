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

    async function createAppointment({ start, end }: Partial<Appointment>) {
        const serviceType: CodeableConcept = {
            text: 'First Appointment',
            coding: [
                {
                    code: 'code',
                    system: 'todo',
                    display: 'First Appointment',
                },
            ],
        };

        const patientReference: InternalReference<Patient> = {
            id: '37b9ef13-5dd4-4e2e-a859-ab44a78f21f5',
            display: 'John Murphy',
            resourceType: 'Patient',
        };

        // const locationReference: InternalReference<Location> = {
        //     id: 'dfbc7669-08c1-4566-9254-a4946ad5efa9',
        //     display: '102 Hobson Street, Auckland',
        //     resourceType: 'Location',
        // };

        const response = await saveFHIRResource<Appointment>({
            resourceType: 'Appointment',
            start,
            end,
            serviceType: [serviceType],
            participant: [
                {
                    actor: patientReference,
                    status: 'accepted',
                },
                {
                    actor: getReference(practitionerRole),
                    status: 'accepted',
                },
                // {
                //     actor: locationReference,
                //     status: 'accepted',
                // },
            ],
            status: 'booked',
        });
        if (isSuccess(response)) {
            notification.success({ message: 'Successfully created' });
        } else {
            notification.error({ message: formatError(response.error) });
        }
    }

    async function handleOkNewAppointment() {
        if (newModalData.appointmentDate.start && newModalData.appointmentDate.end) {
            await createAppointment({
                start: formatFHIRDateTime(newModalData.appointmentDate.start),
                end: formatFHIRDateTime(newModalData.appointmentDate.end),
            });
            setNewModalData((state) => ({
                ...state,
                showNewAppointmentModal: false,
            }));
        } else {
            console.error('the start and end date does not exist');
        }
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
        handleCancelNewAppointment
    };
}
