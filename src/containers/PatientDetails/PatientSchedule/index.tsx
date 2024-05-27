import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { t } from '@lingui/macro';
import { notification } from 'antd';
import { Appointment, Patient } from 'fhir/r4b';
import moment from 'moment';

import { getAllFHIRResources } from 'aidbox-react/lib/services/fhir';

import {
    extractBundleResources,
    formatFHIRDateTime,
    RenderRemoteData,
    useService,
    WithId,
} from '@beda.software/fhir-react';
import { mapSuccess } from '@beda.software/remote-data';

import { Spinner } from 'src/components/Spinner';
import { AppointmentBubble } from 'src/containers/Scheduling/ScheduleCalendar';
import { useAppointmentEvents } from 'src/containers/Scheduling/ScheduleCalendar/hooks/useAppointmentEvents';
import { useCalendarOptions } from 'src/containers/Scheduling/ScheduleCalendar/hooks/useCalendarOptions';

import { AppointmentDetailsPatientModal } from './components/AppointmentDetailsPatientModal';
import { NewAppointmentPatientModal } from './components/NewAppointmentPatientModal';
import { S as SCalendar } from '../../../containers/Scheduling/ScheduleCalendar/ScheduleCalendar.styles';

interface Props {
    patient: WithId<Patient>;
}

export function PatientSchedule(props: Props) {
    const { calendarOptions } = useCalendarOptions();

    const {
        openNewAppointmentModal,
        newAppointmentData,
        closeNewAppointmentModal,
        openAppointmentDetails,
        appointmentDetails,
        closeAppointmentDetails,
    } = useAppointmentEvents();

    const { patient } = props;

    const periodStart = formatFHIRDateTime(moment().startOf('day').subtract(1, 'months'));
    const periodEnd = formatFHIRDateTime(moment().endOf('day').add(1, 'months'));

    const [appointments, appointmentsManager] = useService(async () => {
        return mapSuccess(
            await getAllFHIRResources<Appointment>('Appointment', {
                date: [`ge${periodStart}`, `lt${periodEnd}`],
                'actor:Patient._id': [patient.id],
            }),
            (bundle) => {
                const resources = extractBundleResources(bundle);
                const appointments = resources.Appointment;

                return appointments.map((appointment) => {
                    return {
                        id: appointment.id,
                        title: appointment.serviceType![0]!.text!,
                        start: appointment.start!,
                        end: appointment.end!,
                        status: appointment.status,
                        classNames: [`_${appointment.status}`],
                    };
                });
            },
        );
    }, [periodStart, periodEnd]);

    return (
        <RenderRemoteData remoteData={appointments} renderLoading={Spinner}>
            {(appointmentsList) => {
                return (
                    <>
                        <SCalendar.Calendar>
                            <FullCalendar
                                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                nowIndicator={true}
                                headerToolbar={{
                                    left: 'prev,next today',
                                    center: 'title',
                                    right: 'timeGridWeek,timeGridDay',
                                }}
                                editable={false}
                                selectable={true}
                                select={openNewAppointmentModal}
                                selectMirror={false}
                                initialView="timeGridWeek"
                                initialEvents={appointmentsList}
                                eventContent={AppointmentBubble}
                                eventClick={openAppointmentDetails}
                                buttonText={{
                                    today: t`Today`,
                                    week: t`Week`,
                                    day: t`Day`,
                                }}
                                dayHeaderFormat={{
                                    weekday: 'short',
                                    day: 'numeric',
                                    month: 'short',
                                }}
                                stickyHeaderDates={true}
                                allDaySlot={false}
                                contentHeight={650}
                                slotLabelFormat={{
                                    timeStyle: 'short',
                                }}
                                {...calendarOptions}
                            />
                            {appointmentDetails && (
                                <AppointmentDetailsPatientModal
                                    key={`appointment-details__${appointmentDetails.id}`}
                                    appointmentId={appointmentDetails.id}
                                    status={appointmentDetails.extendedProps.status}
                                    showModal={true}
                                    onClose={closeAppointmentDetails}
                                />
                            )}
                            {newAppointmentData && (
                                <NewAppointmentPatientModal
                                    key={`new-appointment`}
                                    patient={patient}
                                    start={newAppointmentData.start}
                                    showModal={true}
                                    onOk={() => {
                                        closeNewAppointmentModal();
                                        appointmentsManager.reload();
                                        notification.success({
                                            message: t`Appointment successfully added`,
                                        });
                                    }}
                                    onCancel={closeNewAppointmentModal}
                                />
                            )}
                        </SCalendar.Calendar>
                    </>
                );
            }}
        </RenderRemoteData>
    );
}
