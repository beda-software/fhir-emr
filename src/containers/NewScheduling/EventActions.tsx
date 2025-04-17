import { extractBundleResources } from '@beda.software/fhir-react';

import { extractGetParamValue } from './utils';
import { NewEventModalProps } from '../../uberComponents/CalendarPage/types';
import { NewAppointmentModal } from '../OrganizationScheduling/NewAppointmentModal';

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
