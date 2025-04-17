import { extractBundleResources } from '@beda.software/fhir-react';

import { extractGetParamValue } from './utils';
import { NewEventModalProps, EventDetailsProps } from '../../uberComponents/CalendarPage/types';
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
