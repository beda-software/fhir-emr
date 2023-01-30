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

// import './fullCalendar.css';

import { EditAppointmentModal } from './components/EditAppointmentModal';
import { NewAppointmentModal } from './components/NewAppointmentModal';
import { useAppointmentEvents } from './hooks/useAppointmentEvents';
import { useCalendarOptions } from './hooks/useCalendarOptions';
import { useScheduleCalendar } from './hooks/useScheduleCalendar';

interface Props {
    practitionerRole: PractitionerRole;
}

export function ScheduleCalendar({ practitionerRole }: Props) {
    const { calendarOptions } = useCalendarOptions();

    const { remoteResponses, slotsManager } = useScheduleCalendar(practitionerRole);

    const {
        handleEventChange,
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
            <Title level={2}>
                <Trans>Schedule calendar</Trans>
            </Title>
            <RenderRemoteData remoteData={remoteResponses}>
                {({ businessHours, calendarSlots }) => (
                    <>
                        <FullCalendar
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            nowIndicator={true}
                            headerToolbar={{
                                left: 'prev,next today openSettings',
                                center: 'title',
                                right: 'timeGridWeek,timeGridDay',
                            }}
                            customButtons={{
                                openSettings: {
                                    text: 'Settings',
                                    // icon: 'settings',
                                    click: () => {
                                        // eslint-disable-next-line no-alert
                                        alert('Open settings modal');
                                    },
                                },
                            }}
                            businessHours={businessHours}
                            initialView="timeGridWeek"
                            editable={true}
                            selectable={true}
                            selectMirror={true}
                            dayMaxEvents={true}
                            initialEvents={calendarSlots}
                            eventContent={renderEventContent}
                            eventChange={handleEventChange}
                            eventClick={handleEventClick}
                            select={handleGridSelect}
                            {...calendarOptions}
                        />
                        <EditAppointmentModal
                            practitionerRole={practitionerRole}
                            appointmentId={editModalData.clickedAppointmentId}
                            showModal={editModalData.showEditAppointmentModal}
                            onSubmit={() => {}}
                            onClose={() =>
                                setEditModalData((data) => ({
                                    ...data,
                                    showEditAppointmentModal: false,
                                }))
                            }
                        />
                        ,
                        <NewAppointmentModal
                            practitionerRole={practitionerRole}
                            isModalOpen={newModalData.showNewAppointmentModal}
                            onOk={() => {
                                handleOkNewAppointment();
                                slotsManager.reload();
                                notification.success({
                                    message: t`Appointment successfully added`,
                                });
                            }}
                            onCancel={handleCancelNewAppointment}
                        />
                    </>
                )}
            </RenderRemoteData>
        </>
    );
}

function renderEventContent(eventContent: EventContentArg) {
    const titleMaxLength = eventContent.view.type === 'timeGridWeek' ? 20 : 100;
    return (
        <>
            <b>{eventContent.event.title.substr(0, titleMaxLength)}</b>
            <br />
            <i>{eventContent.timeText}</i>
        </>
    );
}
