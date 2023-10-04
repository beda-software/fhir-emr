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
import { SelectOption } from './HealthcareServicePractitionerSelect/types';
import { useOrganizationSchedulingSlots } from './hooks';
import { NewAppointmentModal } from './NewAppointmentModal';
import { EditAppointmentWrapperProps, NewAppointmentModalProps } from './types';
import { getSelectedValue } from './utils';
import { AppointmentBubble } from '../Scheduling/ScheduleCalendar';
import { AppointmentDetailsModal } from '../Scheduling/ScheduleCalendar/components/AppointmentDetailsModal';
import { EditAppointmentModal } from '../Scheduling/ScheduleCalendar/components/EditAppointmentModal';
import { NewAppointmentData, useAppointmentEvents } from '../Scheduling/ScheduleCalendar/hooks/useAppointmentEvents';
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

    const isAppointmentCreatingAvailable = (
        appointmentData: NewAppointmentData,
        selectedPractitionerRole: SelectOption,
        selectedHealthcareService: SelectOption,
    ): boolean => !!appointmentData && !!selectedPractitionerRole && !!selectedHealthcareService;
    const isSelectable = (selectedPractitionerRole: SelectOption, selectedHealthcareService: SelectOption): boolean =>
        !!selectedPractitionerRole && !!selectedHealthcareService;
    // NOTE: In case we don't have business hours (didn't set up for practitioner
    // empty filters results, etc.) We should show the visual sign to the receptionist
    // that there is no available time. By default, the calendar can get false as businessHours property.
    // But in this case, it looks like all day is available.
    const emptyBusinessHours = [
        {
            daysOfWeek: [1, 2, 3, 4, 5, 6, 7],
            startTime: '08:00',
            endTime: '08:00',
        },
    ];

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
                    {({ slots, businessHours, allPractitionersAndPractitionerRoles, healthcareServices }) => (
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
                                    businessHours={businessHours.length ? businessHours.flat() : emptyBusinessHours}
                                    initialView="timeGridWeek"
                                    editable={true}
                                    selectable={isSelectable(selectedHealthcareService, selectedPractitionerRole)}
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
                                        practitionerRoles={allPractitionersAndPractitionerRoles.practitionerRoles}
                                    />
                                )}
                                {newAppointmentData &&
                                    isAppointmentCreatingAvailable(
                                        newAppointmentData,
                                        selectedHealthcareService,
                                        selectedPractitionerRole,
                                    ) && (
                                        <NewAppointmentModalWrapper
                                            newAppointmentData={newAppointmentData!}
                                            closeNewAppointment={closeNewAppointmentModal}
                                            reload={slotsManager.reload}
                                            onClose={closeNewAppointmentModal}
                                            selectedPractitionerRoleId={getSelectedValue(selectedPractitionerRole)}
                                            selectedHealthcareServiceId={getSelectedValue(selectedHealthcareService)}
                                            practitionerRoles={allPractitionersAndPractitionerRoles.practitionerRoles}
                                            practitioners={allPractitionersAndPractitionerRoles.practitioners}
                                            healthcareServices={healthcareServices}
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
    const {
        newAppointmentData,
        closeNewAppointment,
        reload,
        onClose,
        selectedPractitionerRoleId,
        selectedHealthcareServiceId,
        practitionerRoles,
        healthcareServices,
        practitioners,
    } = props;
    const currentPractitionerRole = practitionerRoles.find(
        (practitionerRole) => practitionerRole.id === selectedPractitionerRoleId,
    );
    const currentPractitioner = practitioners.find(
        (practitioner) => practitioner.id === currentPractitionerRole?.practitioner?.reference?.split('/')[1],
    );
    const currentHealthcareService = healthcareServices.find(
        (healthcareService) => healthcareService.id === selectedHealthcareServiceId,
    );

    if (!currentPractitionerRole || !currentHealthcareService || !currentPractitioner) {
        return null;
    }

    return (
        <NewAppointmentModal
            key={`new-appointment`}
            practitionerRole={currentPractitionerRole}
            healthcareService={currentHealthcareService}
            practitioner={currentPractitioner}
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
