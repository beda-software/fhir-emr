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
        handleEventClick,
        handleGridSelect,
        editModalData,
        setEditModalData,
        newModalData,
        handleOkNewAppointment,
        handleCancelNewAppointment,
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
                                eventContent={renderEventContent}
                                eventClick={handleEventClick}
                                select={handleGridSelect}
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
                                // titleFormat={{
                                //     hour12: true,
                                // }}
                                {...calendarOptions}
                            />
                            {editModalData.showEditAppointmentModal && (
                                <EditAppointmentModal
                                    key={`edit-modal-${editModalData.clickedAppointmentId}`}
                                    practitionerRole={practitionerRole}
                                    appointmentId={editModalData.clickedAppointmentId}
                                    showModal={editModalData.showEditAppointmentModal}
                                    onSubmit={() => {
                                        setEditModalData({
                                            clickedAppointmentId: 'undefined',
                                            showEditAppointmentModal: false,
                                        });
                                        // slotsManager.softReloadAsync is not used here, because otherwise the display of appointments in the table will not be updated
                                        slotsManager.reload();
                                        notification.success({
                                            message: t`Appointment successfully rescheduled`,
                                        });
                                    }}
                                    onClose={() =>
                                        setEditModalData((data) => ({
                                            ...data,
                                            showEditAppointmentModal: false,
                                        }))
                                    }
                                />
                            )}
                            {newModalData.showNewAppointmentModal && (
                                <NewAppointmentModal
                                    practitionerRole={practitionerRole}
                                    newModalData={newModalData}
                                    onOk={() => {
                                        handleOkNewAppointment();
                                        slotsManager.reload();
                                        notification.success({
                                            message: t`Appointment successfully added`,
                                        });
                                    }}
                                    onCancel={handleCancelNewAppointment}
                                />
                            )}
                        </>
                    )}
                </RenderRemoteData>
            </div>
        </>
    );
}

function renderEventContent(eventContent: EventContentArg) {
    const titleMaxLength = eventContent.view.type === 'timeGridWeek' ? 20 : 100;
    const status = eventContent.event.extendedProps.status;
    return (
        <>
            <b>{eventContent.event.title.substr(0, titleMaxLength)}</b>
            <br />
            <i>{eventContent.timeText}</i>
            <br />
            {status === 'cancelled' && <i>{status}</i>}
        </>
    );
}
