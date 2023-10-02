import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Trans, t } from '@lingui/macro';

import { RenderRemoteData } from 'fhir-react/lib/components/RenderRemoteData';

import { BasePageHeader, BasePageContent } from 'src/components/BaseLayout';
import { SearchBar } from 'src/components/SearchBar';
import { useSearchBar } from 'src/components/SearchBar/hooks';
import { StringTypeColumnFilterValue } from 'src/components/SearchBar/types';
import { Title } from 'src/components/Typography';

import { S } from './Calendar.styles';
import { useOrganizationSchedulingSlots } from './hooks';

export function OrganizationScheduling() {
    const { columnsFilterValues, onChangeColumnFilter, onResetFilters } = useSearchBar({
        columns: [
            {
                id: 'healthcareService',
                type: 'reference',
                placeholder: 'Search by service',
            },
            {
                id: 'practitionerRole',
                type: 'reference',
                placeholder: 'Search by practitioner',
            },
        ],
    });

    const { remoteResponses } = useOrganizationSchedulingSlots(columnsFilterValues as StringTypeColumnFilterValue[]);

    return (
        <>
            <BasePageHeader style={{ paddingTop: 40, paddingBottom: 92 }}>
                <Title style={{ marginBottom: 40 }}>
                    <Trans>Scheduling</Trans>
                </Title>

                <SearchBar
                    columnsFilterValues={columnsFilterValues}
                    onChangeColumnFilter={onChangeColumnFilter}
                    onResetFilters={onResetFilters}
                />
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
                                />
                            </S.Calendar>
                        </S.Wrapper>
                    )}
                </RenderRemoteData>
            </BasePageContent>
        </>
    );
}
