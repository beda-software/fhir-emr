import { ColumnsType } from 'antd/lib/table';
import { Bundle, Resource } from 'fhir/r4b';
import React from 'react';

import { RenderRemoteData } from '@beda.software/fhir-react';

import { PageContainer } from 'src/components/BaseLayout/PageContainer';
import { Calendar } from 'src/components/Calendar';
import { SearchBar } from 'src/components/SearchBar';
import { useSearchBar } from 'src/components/SearchBar/hooks';

export { customAction, navigationAction, questionnaireAction } from '../ResourceListPage/actions';
import { useHealthcareServicePractitionerSelect } from '../../containers/OrganizationScheduling/HealthcareServicePractitionerSelect/hooks';
import { useOrganizationSchedulingSlots } from '../../containers/OrganizationScheduling/hooks';
import { getSelectedValue } from '../../containers/OrganizationScheduling/utils';
import { AppointmentBubble } from '../../containers/Scheduling/ScheduleCalendar';
import { useAppointmentEvents } from '../../containers/Scheduling/ScheduleCalendar/hooks/useAppointmentEvents';
import { HeaderQuestionnaireAction, WebExtra } from '../ResourceListPage/actions';
import { useResourceListPage } from '../ResourceListPage/hooks';
import { ResourceListProps, TableManager } from '../ResourceListPage/types';

type RecordType<R extends Resource> = { resource: R; bundle: Bundle };

type ResourceListPageProps<R extends Resource> = ResourceListProps<R, WebExtra> & {
    /* Page header title (for example, Organizations) */
    headerTitle: string;

    /* Page content max width */
    maxWidth?: number | string;

    /* Table columns without action column - action column is generated based on `getRecordActions` */
    getTableColumns: (manager: TableManager) => ColumnsType<RecordType<R>>;
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
}: ResourceListPageProps<R>) {
    const allFilters = getFilters?.() ?? [];

    const { columnsFilterValues, onChangeColumnFilter, onResetFilters } = useSearchBar({
        columns: allFilters ?? [],
    });

    const { reload } = useResourceListPage(
        resourceType,
        extractPrimaryResources,
        columnsFilterValues,
        searchParams ?? {},
    );

    // TODO: move to hooks
    const headerActions = getHeaderActions?.() ?? [];

    const { openNewAppointmentModal, openAppointmentDetails } = useAppointmentEvents();
    const { selectedHealthcareService, selectedPractitionerRole } = useHealthcareServicePractitionerSelect();
    const { remoteResponses } = useOrganizationSchedulingSlots({
        healthcareServiceId: getSelectedValue(selectedHealthcareService),
        practitionerRoleId: getSelectedValue(selectedPractitionerRole),
    });

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
            <RenderRemoteData remoteData={remoteResponses}>
                {({ slots, businessHours }) => (
                    <Calendar
                        businessHours={businessHours.length ? businessHours.flat() : emptyBusinessHours}
                        initialEvents={slots.slotsData}
                        eventContent={AppointmentBubble}
                        eventClick={openAppointmentDetails}
                        select={openNewAppointmentModal}
                    />
                )}
            </RenderRemoteData>
        </PageContainer>
    );
}
