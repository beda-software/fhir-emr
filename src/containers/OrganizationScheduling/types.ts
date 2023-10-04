import { Appointment, HealthcareService, Practitioner, PractitionerRole } from 'fhir/r4b';

import { NewAppointmentData } from '../Scheduling/ScheduleCalendar/hooks/useAppointmentEvents';

export interface EditAppointmentWrapperProps {
    editingAppointmentId: string;
    closeEditAppointment: () => void;
    reload: () => void;
    onClose: () => void;
    appointments: Appointment[];
    practitionerRoles: PractitionerRole[];
}

export interface NewAppointmentModalProps {
    newAppointmentData: NewAppointmentData;
    closeNewAppointment: () => void;
    reload: () => void;
    onClose: () => void;
    selectedPractitionerRoleId: string;
    selectedHealthcareServiceId: string;
    practitionerRoles: PractitionerRole[];
    healthcareServices: HealthcareService[];
    practitioners: Practitioner[];
}
