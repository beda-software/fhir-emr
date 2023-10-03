import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Trans, t } from '@lingui/macro';
import { Button, Row, notification } from 'antd';

import { RenderRemoteData } from 'fhir-react/lib/components/RenderRemoteData';

import { BasePageHeader, BasePageContent } from 'src/components/BaseLayout';
import { Title } from 'src/components/Typography';

import { S } from './Calendar.styles';
import { HealthcareServicePractitionerSelect } from './HealthcareServicePractitionerSelect';
import { useHealthcareServicePractitionerSelect } from './HealthcareServicePractitionerSelect/hooks';
import { useOrganizationSchedulingSlots } from './hooks';
import { NewAppointmentModal } from './NewAppointmentModal';
import { EditAppointmentWrapperProps, NewAppointmentModalProps } from './types';
import { getSelectedValue } from './utils';
import { AppointmentBubble } from '../Scheduling/ScheduleCalendar';
import { AppointmentDetailsModal } from '../Scheduling/ScheduleCalendar/components/AppointmentDetailsModal';
import { EditAppointmentModal } from '../Scheduling/ScheduleCalendar/components/EditAppointmentModal';
import { useAppointmentEvents } from '../Scheduling/ScheduleCalendar/hooks/useAppointmentEvents';
import { useCalendarOptions } from '../Scheduling/ScheduleCalendar/hooks/useCalendarOptions';

export function OrganizationScheduling() {
    const { calendarOptions } = useCalendarOptions();
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
    } = useAppointmentEvents();
    const {
        selectedHealthcareService,
        selectedPractitionerRole,
        practitionerRoleOptions,
        healthcareServiceOptions,
        onChange,
        resetFilter,
    } = useHealthcareServicePractitionerSelect();
    const { remoteResponses, slotsManager } = useOrganizationSchedulingSlots({
        healthcareServiceId: getSelectedValue(selectedHealthcareService),
        practitionerRoleId: getSelectedValue(selectedPractitionerRole),
    });

    return (
        <>
            <BasePageHeader style={{ paddingTop: 40, paddingBottom: 92 }}>
                <Title style={{ marginBottom: 40 }}>
                    <Trans>Scheduling</Trans>
                </Title>
                <S.SearchBarContainer>
                    <Row gutter={[32, 16]}>
                        <HealthcareServicePractitionerSelect
                            selectedHealthcareService={selectedHealthcareService}
                            selectedPractitionerRole={selectedPractitionerRole}
                            loadHealthcareServiceOptions={healthcareServiceOptions}
                            loadPractitionerRoleOptions={practitionerRoleOptions}
                            onChangeHealthcareService={(selectedOption) =>
                                onChange(selectedOption, 'healthcareService')
                            }
                            onChangePractitionerRole={(selectedOption) => onChange(selectedOption, 'practitionerRole')}
                        />
                    </Row>
                    <Button onClick={resetFilter}>
                        <Trans>Reset</Trans>
                    </Button>
                </S.SearchBarContainer>
            </BasePageHeader>
            <BasePageContent style={{ marginTop: '-55px', paddingTop: 0 }}>
                <RenderRemoteData remoteData={remoteResponses}>
                    {({ slots, businessHours }) => (
                        <S.Wrapper>
                            <S.Calendar>
                                <FullCalendar
                                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                    nowIndicator={true}
                                    headerToolbar={{
                                        left: 'prev,next today',
                                        center: 'title',
                                        right: 'timeGridWeek,timeGridDay',
                                    }}
                                    businessHours={businessHours.flat()}
                                    initialView="timeGridWeek"
                                    editable={true}
                                    selectable={true}
                                    selectMirror={true}
                                    dayMaxEvents={true}
                                    initialEvents={slots.slotsData}
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
                                    slotLabelFormat={{
                                        timeStyle: 'short',
                                    }}
                                    {...calendarOptions}
                                />
                                {appointmentDetails && (
                                    <AppointmentDetailsModal
                                        key={`appointment-details__${appointmentDetails.id}`}
                                        appointmentId={appointmentDetails.id}
                                        status={appointmentDetails.extendedProps.status}
                                        showModal={true}
                                        onEdit={(id) => openEditAppointment(id)}
                                        onClose={closeAppointmentDetails}
                                    />
                                )}
                                {editingAppointmentId && (
                                    <EditAppointmentWrapper
                                        editingAppointmentId={editingAppointmentId}
                                        closeEditAppointment={closeEditAppointment}
                                        reload={slotsManager.reload}
                                        onClose={closeEditAppointment}
                                        appointments={slots.appointments}
                                        practitionerRoles={slots.practitionerRoles}
                                    />
                                )}
                                {newAppointmentData && selectedHealthcareService && selectedPractitionerRole && (
                                    <NewAppointmentModalWrapper
                                        newAppointmentData={newAppointmentData}
                                        closeNewAppointment={closeNewAppointmentModal}
                                        reload={slotsManager.reload}
                                        onClose={closeNewAppointmentModal}
                                        selectedPractitionerRoleId={getSelectedValue(selectedPractitionerRole)}
                                        practitionerRoles={slots.practitionerRoles}
                                    />
                                )}
                            </S.Calendar>
                        </S.Wrapper>
                    )}
                </RenderRemoteData>
            </BasePageContent>
        </>
    );
}

function EditAppointmentWrapper(props: EditAppointmentWrapperProps) {
    const { editingAppointmentId, closeEditAppointment, reload, onClose, appointments, practitionerRoles } = props;
    const currentAppointment = appointments.find((appointment) => appointment.id === editingAppointmentId);
    const currentAppointmentPractitionerRoleRef = currentAppointment?.participant?.find((participant) => {
        const actorReference = participant.actor?.reference;
        const referenceType = actorReference?.split('/')[0];
        return referenceType === 'PractitionerRole';
    });
    const currentPractitionerRole = practitionerRoles.find((practitionerRole) => {
        const currentPractitionerRoleId = currentAppointmentPractitionerRoleRef?.actor?.reference?.split('/')[1];
        return practitionerRole.id === currentPractitionerRoleId;
    });

    if (!currentPractitionerRole) {
        return null;
    }

    return (
        <EditAppointmentModal
            key={`editing-appointment__${editingAppointmentId}`}
            practitionerRole={currentPractitionerRole}
            appointmentId={editingAppointmentId}
            showModal={true}
            onSubmit={() => {
                closeEditAppointment();
                reload();
                notification.success({
                    message: t`Appointment successfully rescheduled`,
                });
            }}
            onClose={onClose}
        />
    );
}

function NewAppointmentModalWrapper(props: NewAppointmentModalProps) {
    const { newAppointmentData, closeNewAppointment, reload, onClose, selectedPractitionerRoleId, practitionerRoles } =
        props;
    const currentPractitionerRole = practitionerRoles.find(
        (practitionerRole) => practitionerRole.id === selectedPractitionerRoleId,
    );

    if (!currentPractitionerRole) {
        return null;
    }

    return (
        <NewAppointmentModal
            key={`new-appointment`}
            practitionerRole={currentPractitionerRole}
            start={newAppointmentData.start}
            end={newAppointmentData.end}
            showModal={true}
            onOk={() => {
                closeNewAppointment();
                reload();
                notification.success({
                    message: t`Appointment successfully added`,
                });
            }}
            onCancel={onClose}
        />
    );
}
