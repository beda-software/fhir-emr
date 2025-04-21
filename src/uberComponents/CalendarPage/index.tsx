import { Bundle, Resource } from 'fhir/r4b';
import React from 'react';

import { RenderRemoteData } from '@beda.software/fhir-react';

import { PageContainer } from 'src/components/BaseLayout/PageContainer';
import { Calendar } from 'src/components/Calendar';
import { SearchBar } from 'src/components/SearchBar';
import { useSearchBar } from 'src/components/SearchBar/hooks';

import { CalendarEventQuestionnaireAction } from './actions';
import { useCalendarPage } from './hooks';
import { CalendarPageProps } from './types';
import { HeaderQuestionnaireAction } from '../ResourceListPage/actions';
export { customAction, navigationAction, questionnaireAction } from '../ResourceListPage/actions';

export function CalendarPage<R extends Resource>(props: CalendarPageProps<R>) {
    const {
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
        calendarEventActions,
    } = props;
    const { columnsFilterValues, onChangeColumnFilter, onResetFilters } = useSearchBar({
        columns: getFilters?.() ?? [],
    });

    const { reload, recordResponse, eventCreate, eventShow, questionnaireActions, emptyBusinessHours } =
        useCalendarPage(
            resourceType,
            extractPrimaryResources,
            columnsFilterValues,
            searchParams ?? {},
            calendarEventActions,
        );

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
                    const existingResource = eventShow.data?.extendedProps?.fullResource;
                    const defaultEventQuetionnaireActionProps = {
                        reload: reload,
                        defaultLaunchContext: [],
                        resource: existingResource ? (existingResource as R) : ({ resourceType: 'Appointment' } as R),
                    };

                    return (
                        <>
                            <Calendar
                                businessHours={bs}
                                initialEvents={slotsData}
                                eventContent={eventContent}
                                eventClick={eventShow.modalOpen}
                                select={eventCreate.modalOpen}
                            />
                            {eventShow.show && (
                                <CalendarEventQuestionnaireAction<R>
                                    key="show-details-questionnaire-action"
                                    action={questionnaireActions.show}
                                    {...defaultEventQuetionnaireActionProps}
                                />
                            )}
                            {eventCreate.show && (
                                <CalendarEventQuestionnaireAction<R>
                                    key="create-questionnaire-action"
                                    action={questionnaireActions.create}
                                    {...defaultEventQuetionnaireActionProps}
                                />
                            )}
                        </>
                    );
                }}
            </RenderRemoteData>
        </PageContainer>
    );
}
