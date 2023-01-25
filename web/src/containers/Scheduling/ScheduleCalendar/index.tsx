// eslint-disable-next-line import/order
import FullCalendar, { EventContentArg } from '@fullcalendar/react'; // import it first
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { PageHeader } from 'antd';

import { PractitionerRole } from 'shared/src/contrib/aidbox';

import { PageContent } from 'src/components/PageContent';
import { RenderRemoteData } from 'src/components/RenderRemoteData';
import './fullCalendar.css';
import { useAppointmentEvents } from 'src/containers/Scheduling/ScheduleCalendar/hooks/useAppointmentEvents';
import { useCalendarOptions } from 'src/containers/Scheduling/ScheduleCalendar/hooks/useCalendarOptions';
import { useScheduleCalendar } from 'src/containers/Scheduling/ScheduleCalendar/hooks/useScheduleCalendar';

import { EditAppointmentModal } from './components/EditAppointmentModal';

interface Props {
    practitionerRole: PractitionerRole;
}

export function ScheduleCalendar({ practitionerRole }: Props) {
    const { calendarOptions } = useCalendarOptions();

    const { remoteResponses } = useScheduleCalendar(practitionerRole);

    const {
        handleEventChange,
        handleEventClick,
        handleGridSelect,
        editModalData,
        setEditModalData,
    } = useAppointmentEvents(practitionerRole);

    return (
        <PageContent header={<PageHeader title="Schedule calendar" ghost={false} />}>
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
                    </>
                )}
            </RenderRemoteData>
        </PageContent>
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
