import { Resource } from 'fhir/r4b';
import React from 'react';

import { RenderRemoteData, WithId } from '@beda.software/fhir-react';

import { PageContainer } from 'src/components/BaseLayout/PageContainer';
import { Calendar } from 'src/components/Calendar';
import { SearchBar } from 'src/components/SearchBar';
import { useSearchBar } from 'src/components/SearchBar/hooks';

import { CalendarEventQuestionnaireAction } from './actions';
import { EventContent } from './EventContent';
import { useCalendarPage } from './hooks';
import { ResourceCalendarPageProps } from './types';
import { HeaderQuestionnaireAction } from '../ResourceListPage/actions';
export { customAction, navigationAction, questionnaireAction } from '../ResourceListPage/actions';

export function ResourceCalendarPage<R extends WithId<Resource>>(props: ResourceCalendarPageProps<R>) {
    const {
        headerTitle: title,
        resourceType,
        extractPrimaryResources,
        searchParams,
        getHeaderActions,
        getFilters,
        defaultLaunchContext,
        event,
        slot,
        calendarOptions,
    } = props;
    const { columnsFilterValues, onChangeColumnFilter, onResetFilters } = useSearchBar({
        columns: getFilters?.() ?? [],
    });

    const {
        reload,
        eventResponse,
        eventCreate,
        eventShow,
        eventEdit,
        questionnaireActions,
        defaultEventQuetionnaireActionProps,
    } = useCalendarPage(resourceType, extractPrimaryResources, columnsFilterValues, searchParams ?? {}, event, slot);

    return (
        <PageContainer
            title={title}
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
            <RenderRemoteData remoteData={eventResponse}>
                {({ recordResponse, slotRecordResponse }) => (
                    <>
                        <Calendar
                            initialEvents={[...recordResponse, ...(slotRecordResponse ? slotRecordResponse : [])]}
                            eventContent={EventContent}
                            eventClick={eventShow.modalOpen}
                            select={eventCreate.modalOpen}
                            {...calendarOptions}
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
                                onSuccess={questionnaireActions.create.extra?.modalProps?.onCancel}
                                {...defaultEventQuetionnaireActionProps}
                            />
                        )}
                        {eventEdit.show && (
                            <CalendarEventQuestionnaireAction<R>
                                key="edit-questionnaire-action"
                                action={questionnaireActions.edit}
                                onSuccess={questionnaireActions.edit.extra?.modalProps?.onCancel}
                                {...defaultEventQuetionnaireActionProps}
                            />
                        )}
                    </>
                )}
            </RenderRemoteData>
        </PageContainer>
    );
}
