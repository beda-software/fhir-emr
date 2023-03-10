import { EventContentArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react'; // import it first
import timeGridPlugin from '@fullcalendar/timegrid';
import { t, Trans } from '@lingui/macro';
import { notification } from 'antd';
import Title from 'antd/es/typography/Title';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';

import { PractitionerRole } from 'shared/src/contrib/aidbox';

import { AppointmentDetailsModal } from './components/AppointmentDetailsModal';
import { EditAppointmentModal } from './components/EditAppointmentModal';
import { NewAppointmentModal } from './components/NewAppointmentModal';
import { useAppointmentEvents } from './hooks/useAppointmentEvents';
import { useCalendarOptions } from './hooks/useCalendarOptions';
import { useScheduleCalendar } from './hooks/useScheduleCalendar';
import s from './ScheduleCalendar.module.scss';

interface Props {
    practitionerRole: PractitionerRole;
}

export function ScheduleCalendar({ practitionerRole }: Props) {
    const { calendarOptions } = useCalendarOptions();

    const { remoteResponses, slotsManager } = useScheduleCalendar(practitionerRole);

    const {
        openNewAppointmentModal,
        newAppointmentData,
        closeNewAppointmentModal,
        openAppointmentDetails,
        appointmentDetails,
        closeAppointmentDetails,
        openEditAppointment,
        editingAppointmentId,
        closeEditAppointment,
    } = useAppointmentEvents(practitionerRole);

    return (
        <>
            <Title level={3} className={s.title}>
                <Trans>Schedule calendar</Trans>
            </Title>
            <div className={s.calendar}>
                <RenderRemoteData remoteData={remoteResponses}>
                    {({ businessHours, calendarSlots }) => (
                        <>
                            <FullCalendar
                                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                nowIndicator={true}
                                headerToolbar={{
                                    left: 'prev,next today',
                                    center: 'title',
                                    right: 'timeGridWeek,timeGridDay',
                                }}
                                businessHours={businessHours}
                                initialView="timeGridWeek"
                                editable={true}
                                selectable={true}
                                selectMirror={true}
                                dayMaxEvents={true}
                                initialEvents={calendarSlots}
                                eventContent={AppointmentBubble}
                                eventClick={openAppointmentDetails}
                                select={openNewAppointmentModal}
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
                                <AppointmentDetailsModal
                                    key={`appointment-details__${appointmentDetails.id}`}
                                    practitionerRole={practitionerRole}
                                    appointmentId={appointmentDetails.id}
                                    status={appointmentDetails.extendedProps.status}
                                    showModal={true}
                                    onEdit={(id) => openEditAppointment(id)}
                                    onClose={closeAppointmentDetails}
                                />
                            )}
                            {editingAppointmentId && (
                                <EditAppointmentModal
                                    key={`editing-appointment__${editingAppointmentId}`}
                                    practitionerRole={practitionerRole}
                                    appointmentId={editingAppointmentId}
                                    showModal={true}
                                    onSubmit={() => {
                                        closeEditAppointment();
                                        // slotsManager.softReloadAsync is not used here, because otherwise the display of appointments in the table will not be updated
                                        slotsManager.reload();
                                        notification.success({
                                            message: t`Appointment successfully rescheduled`,
                                        });
                                    }}
                                    onClose={closeEditAppointment}
                                />
                            )}
                            {newAppointmentData && (
                                <NewAppointmentModal
                                    key={`new-appointment`}
                                    practitionerRole={practitionerRole}
                                    start={newAppointmentData.start}
                                    end={newAppointmentData.end}
                                    showModal={true}
                                    onOk={() => {
                                        closeNewAppointmentModal();
                                        slotsManager.reload();
                                        notification.success({
                                            message: t`Appointment successfully added`,
                                        });
                                    }}
                                    onCancel={closeNewAppointmentModal}
                                />
                            )}
                        </>
                    )}
                </RenderRemoteData>
            </div>
        </>
    );
}

function AppointmentBubble(eventContent: EventContentArg) {
    const status = eventContent.event.extendedProps.status;

    return (
        <div className={s.event}>
            <div className={s.eventName}>{eventContent.event.title}</div>
            <div>{eventContent.timeText}</div>
            {status === 'cancelled' && <div>{status}</div>}
        </div>
    );
}
