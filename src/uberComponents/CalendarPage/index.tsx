import { Bundle, Resource } from 'fhir/r4b';
import React from 'react';

import { RenderRemoteData } from '@beda.software/fhir-react';

import { PageContainer } from 'src/components/BaseLayout/PageContainer';
import { Calendar } from 'src/components/Calendar';
import { SearchBar } from 'src/components/SearchBar';
import { useSearchBar } from 'src/components/SearchBar/hooks';

import { useCalendarPage } from './hooks';
import { CalendarPageProps } from './types';
import { AppointmentBubble } from '../../containers/Scheduling/ScheduleCalendar';
import { useAppointmentEvents } from '../../containers/Scheduling/ScheduleCalendar/hooks/useAppointmentEvents';
import { HeaderQuestionnaireAction } from '../ResourceListPage/actions';

export { customAction, navigationAction, questionnaireAction } from '../ResourceListPage/actions';

export function CalendarPage<R extends Resource>({
    headerTitle: title,
    maxWidth,
    resourceType,
    extractPrimaryResources,
    searchParams,
    getHeaderActions,
    getFilters,
    defaultLaunchContext,
    eventConfig,
    businessHours,
    newEventModal,
    eventDetails,
}: CalendarPageProps<R>) {
    const allFilters = getFilters?.() ?? [];

    const { columnsFilterValues, onChangeColumnFilter, onResetFilters } = useSearchBar({
        columns: allFilters ?? [],
    });

    const { reload, recordResponse } = useCalendarPage(
        resourceType,
        extractPrimaryResources,
        columnsFilterValues,
        searchParams ?? {},
    );

    const headerActions = getHeaderActions?.() ?? [];

    const {
        openEditAppointment,
        closeAppointmentDetails,
        appointmentDetails,
        openNewAppointmentModal,
        openAppointmentDetails,
        newAppointmentData,
        closeNewAppointmentModal,
    } = useAppointmentEvents();

    console.log('appointmentDetails', appointmentDetails);

    const emptyBusinessHours = [
        {
            daysOfWeek: [1, 2, 3, 4, 5, 6, 7],
            startTime: '08:00',
            endTime: '08:00',
        },
    ];

    return (
        <PageContainer
            title={title}
            maxWidth={maxWidth}
            titleRightElement={headerActions.map((action, index) => (
                <React.Fragment key={index}>
                    <HeaderQuestionnaireAction
                        action={action}
                        reload={reload}
                        defaultLaunchContext={defaultLaunchContext ?? []}
                    />
                </React.Fragment>
            ))}
            headerContent={
                columnsFilterValues.length ? (
                    <SearchBar
                        columnsFilterValues={columnsFilterValues}
                        onChangeColumnFilter={onChangeColumnFilter}
                        onResetFilters={onResetFilters}
                    />
                ) : null
            }
        >
            <RenderRemoteData remoteData={recordResponse}>
                {(data) => {
                    const slotsData = data?.map((item) => eventConfig(item?.resource, item?.bundle));
                    const bundle = data?.[0]?.bundle as Bundle | undefined;
                    const businessHoursData = bundle ? businessHours?.(bundle) : undefined;
                    const bs = businessHoursData?.length ? businessHoursData : emptyBusinessHours;

                    return (
                        <>
                            <Calendar
                                businessHours={bs}
                                initialEvents={slotsData}
                                eventContent={AppointmentBubble}
                                eventClick={openAppointmentDetails}
                                select={openNewAppointmentModal}
                            />
                            {newEventModal &&
                                newEventModal({
                                    bundle: bundle!,
                                    newEventData: newAppointmentData,
                                    onOk: () => {
                                        reload();
                                        closeNewAppointmentModal();
                                    },
                                    onClose: closeNewAppointmentModal,
                                })}
                            {eventDetails &&
                                eventDetails({
                                    eventDetailsData: appointmentDetails,
                                    openEvent: openEditAppointment,
                                    onClose: closeAppointmentDetails,
                                })}
                        </>
                    );
                }}
            </RenderRemoteData>
        </PageContainer>
    );
}
