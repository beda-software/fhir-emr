import { Bundle, Resource } from 'fhir/r4b';
import React from 'react';

import { RenderRemoteData } from '@beda.software/fhir-react';

import { PageContainer } from 'src/components/BaseLayout/PageContainer';
import { Calendar } from 'src/components/Calendar';
import { SearchBar } from 'src/components/SearchBar';
import { useSearchBar } from 'src/components/SearchBar/hooks';

import { CalendarEventQuestionnaireAction } from './actions';
import { useCalendarPage, useCalendarEvents } from './hooks';
import { CalendarPageProps } from './types';
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
    eventContent,
    businessHours,
    newEventModal,
    eventDetailsModal,
    eventEditModal,
    calendarEventDetails,
}: CalendarPageProps<R>) {
    const { columnsFilterValues, onChangeColumnFilter, onResetFilters } = useSearchBar({
        columns: getFilters?.() ?? [],
    });

    const { reload, recordResponse } = useCalendarPage(
        resourceType,
        extractPrimaryResources,
        columnsFilterValues,
        searchParams ?? {},
    );

    const {
        openNewEventModal,
        newEventData,
        closeNewEventModal,
        openEventDetails,
        eventDetails,
        editingEventId,
        closeEditEvent,
    } = useCalendarEvents();

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
            titleRightElement={(getHeaderActions?.() ?? []).map((action, index) => (
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
                    console.log('eventDetails', eventDetails?.extendedProps?.fullResource);
                    const existingResource = eventDetails?.extendedProps?.fullResource;

                    return (
                        <>
                            <Calendar
                                businessHours={bs}
                                initialEvents={slotsData}
                                eventContent={eventContent}
                                eventClick={openEventDetails}
                                select={openNewEventModal}
                            />
                            <CalendarEventQuestionnaireAction<Resource>
                                key="open-details-questionnaire-action"
                                action={{
                                    questionnaireId: calendarEventDetails.questionnaireId,
                                    title: calendarEventDetails.title,
                                    type: 'questionnaire',
                                    extra: { modalProps: { open: Boolean(eventDetails) } },
                                }}
                                reload={reload}
                                defaultLaunchContext={[]}
                                resource={
                                    existingResource ? (existingResource as Resource) : { resourceType: 'Appointment' }
                                }
                            />
                            {newEventModal &&
                                newEventModal({
                                    bundle: bundle!,
                                    newEventData: newEventData,
                                    onOk: () => {
                                        reload();
                                        closeNewEventModal();
                                    },
                                    onClose: closeNewEventModal,
                                })}
                            {/* {eventDetailsModal &&
                            eventDetailsModal({
                            eventDetailsData: eventDetails,
                            openEvent: openEditEvent,
                            onClose: closeEventDetails,
                            })} */}
                            {eventEditModal &&
                                eventEditModal({
                                    eventIdToEdit: editingEventId,
                                    closeEditEvent: closeEditEvent,
                                    reload: reload,
                                    onClose: closeEditEvent,
                                    bundle: bundle!,
                                })}
                        </>
                    );
                }}
            </RenderRemoteData>
        </PageContainer>
    );
}
