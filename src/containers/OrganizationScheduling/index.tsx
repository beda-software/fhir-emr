import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Trans, t } from '@lingui/macro';
import { Button, Row } from 'antd';

import { RenderRemoteData } from 'fhir-react/lib/components/RenderRemoteData';

import { BasePageHeader, BasePageContent } from 'src/components/BaseLayout';
import { Title } from 'src/components/Typography';

import { S } from './Calendar.styles';
import { HealthcareServicePractitionerSelect } from './HealthcareServicePractitionerSelect';
import { useHealthcareServicePractitionerSelect } from './HealthcareServicePractitionerSelect/hooks';
import { useOrganizationSchedulingSlots } from './hooks';
import { getSelectedValue } from './utils';
import { useCalendarOptions } from '../Scheduling/ScheduleCalendar/hooks/useCalendarOptions';

export function OrganizationScheduling() {
    const { calendarOptions } = useCalendarOptions();
    const {
        selectedHealthcareService,
        selectedPractitionerRole,
        practitionerRoleOptions,
        healthcareServiceOptions,
        onChange,
        resetFilter,
    } = useHealthcareServicePractitionerSelect();
    const { remoteResponses } = useOrganizationSchedulingSlots({
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
                                    initialEvents={slots}
                                    // eventContent={AppointmentBubble}
                                    // eventClick={openAppointmentDetails}
                                    // select={openNewAppointmentModal}
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
                            </S.Calendar>
                        </S.Wrapper>
                    )}
                </RenderRemoteData>
            </BasePageContent>
        </>
    );
}
