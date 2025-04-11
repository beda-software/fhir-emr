import { Bundle, Resource } from 'fhir/r4b';
import React from 'react';

import { RenderRemoteData } from '@beda.software/fhir-react';

import { PageContainer } from 'src/components/BaseLayout/PageContainer';
import { Calendar } from 'src/components/Calendar';
import { SearchBar } from 'src/components/SearchBar';
import { useSearchBar } from 'src/components/SearchBar/hooks';

import { useCalendarPage } from './hooks';
import { AppointmentBubble } from '../../containers/Scheduling/ScheduleCalendar';
import { useAppointmentEvents } from '../../containers/Scheduling/ScheduleCalendar/hooks/useAppointmentEvents';
import { HeaderQuestionnaireAction, WebExtra } from '../ResourceListPage/actions';
import { ResourceListProps } from '../ResourceListPage/types';

export { customAction, navigationAction, questionnaireAction } from '../ResourceListPage/actions';

type EventConfig = {
    id: string;
    title: string;
    start: string;
    end: string;
    status: string;
    classNames: string[];
};
type CalendarPageProps<R extends Resource> = ResourceListProps<R, WebExtra> & {
    headerTitle: string;
    eventConfig: (r: Resource, bundle: Bundle) => EventConfig;
    businessHours?: {
        daysOfWeek: number[] | undefined;
        startTime: string | undefined;
        endTime: string | undefined;
    }[];
    maxWidth?: number | string;
};

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

    const { openNewAppointmentModal, openAppointmentDetails } = useAppointmentEvents();

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
                    return (
                        <Calendar
                            businessHours={businessHours ? businessHours : emptyBusinessHours}
                            initialEvents={slotsData}
                            eventContent={AppointmentBubble}
                            eventClick={openAppointmentDetails}
                            select={openNewAppointmentModal}
                        />
                    );
                }}
            </RenderRemoteData>
        </PageContainer>
    );
}
