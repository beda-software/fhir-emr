import { EventContentArg } from '@fullcalendar/core';

import { extractBundleResources } from '@beda.software/fhir-react';

import { extractGetParamValue } from './utils';
import { NewEventModalProps, EventDetailsProps, EventEditProps } from '../../uberComponents/CalendarPage/types';
import { EditAppointmentWrapper } from '../OrganizationScheduling';
import { NewAppointmentModal } from '../OrganizationScheduling/NewAppointmentModal';
import { AppointmentDetailsModal } from '../Scheduling/ScheduleCalendar/components/AppointmentDetailsModal';

export function newEventModal(props: NewEventModalProps) {
    const { bundle, newEventData, onOk, onClose } = props;
    if (!bundle || !bundle.link?.[0]?.url || !newEventData) return null;

    const { start, end } = newEventData;
    const resourcesMap = extractBundleResources(bundle);
    const practitionerRole = resourcesMap.PractitionerRole?.[0];
    const practitioner = resourcesMap.Practitioner?.[0];
    const healthcareService = resourcesMap.HealthcareService?.find(
        (r) => r.id == extractGetParamValue(bundle?.link?.[0]?.url, 'service-type'),
    );

    if (!practitionerRole || !practitioner || !healthcareService) {
        return null;
    }

    return (
        <NewAppointmentModal
            key="new-appointment"
            practitionerRole={practitionerRole}
            healthcareService={healthcareService}
            practitioner={practitioner}
            start={start}
            end={end}
            onOk={onOk}
            onCancel={onClose}
            showModal={true}
        />
    );
}

export function detailsModal(props: EventDetailsProps) {
    const { eventDetailsData, openEvent, onClose } = props;

    if (!eventDetailsData) return null;

    return (
        <AppointmentDetailsModal
            key={`appointment-details__${eventDetailsData.id}`}
            appointmentId={eventDetailsData.id}
            status={eventDetailsData.extendedProps.status}
            showModal={true}
            onEdit={openEvent}
            onClose={onClose}
        />
    );
}

export function editEventModal(props: EventEditProps) {
    const { eventIdToEdit, closeEditEvent, reload, onClose, bundle } = props;
    if (!eventIdToEdit || !bundle) return null;
    const resourcesMap = extractBundleResources(bundle);
    const practitionerRoles = resourcesMap.PractitionerRole;
    const appointments = resourcesMap.Appointment;

    return (
        <EditAppointmentWrapper
            editingAppointmentId={eventIdToEdit}
            closeEditAppointment={closeEditEvent}
            reload={reload}
            onClose={onClose}
            appointments={appointments}
            practitionerRoles={practitionerRoles}
        />
    );
}

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
