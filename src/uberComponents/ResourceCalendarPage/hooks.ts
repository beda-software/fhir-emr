import { Bundle, Resource } from 'fhir/r4b';
import { useMemo, useState } from 'react';

import { parseFHIRDate, formatFHIRDate, SearchParams, WithId, useService } from '@beda.software/fhir-react';

import { ColumnFilterValue } from 'src/components/SearchBar/types';
import { useDebounce } from 'src/utils/debounce';

import { getSlots, getMainResources } from './services';
import { ResourceCalendarPageProps } from './types';
import {
    useCalendarEvents,
    extractPrimaryResourcesFactory,
    defaultSelectedDates,
    calculateSearchParams,
    prepareResourceToShowOrEdit,
    defaultEventQuestionnaireProps,
    prepareEvents,
} from './utils';

export function useCalendarPage<R extends WithId<Resource>>(
    resourceType: R['resourceType'],
    extractPrimaryResources: ((bundle: Bundle) => R[]) | undefined,
    filterValues: ColumnFilterValue[],
    defaultSearchParams: SearchParams,
    event: ResourceCalendarPageProps<R>['event'],
    slot: ResourceCalendarPageProps<R>['slot'],
) {
    const [selectedDates, setSelectedDates] = useState<SearchParams>(defaultSelectedDates);
    const { eventSearchParams, slotSearchParams } = calculateSearchParams(
        useDebounce(filterValues, 300),
        defaultSearchParams,
        selectedDates,
        event?.searchParamsMapping ?? {},
        slot?.searchParamsMapping ?? {},
    );
    const { eventCreate, eventShow, eventEdit, questionnaireActions } = useCalendarEvents<R>(
        event.actions,
        eventSearchParams,
    );
    const [resourceResponse, resourceManager] = useService(
        async () => getMainResources<R>(resourceType, eventSearchParams),
        [JSON.stringify(eventSearchParams)],
    );
    const [slotResourceResponse, slotPagerManager] = useService(
        async () => getSlots(slot?.operationUrl, slotSearchParams),
        [JSON.stringify(slotSearchParams)],
    );
    const reload = () => {
        resourceManager.reload();
        slotPagerManager.reload();
    };
    const extractPrimaryResourcesMemoized = useMemo(
        () => extractPrimaryResources ?? extractPrimaryResourcesFactory(resourceType),
        [resourceType, extractPrimaryResources],
    );
    const eventResponse = useMemo(
        () => prepareEvents<R>(resourceResponse, slotResourceResponse, extractPrimaryResourcesMemoized, event, slot),
        [resourceResponse, slotResourceResponse],
    );
    const resourceToShowOrEdit = useMemo(
        () => prepareResourceToShowOrEdit(eventShow, eventCreate, eventEdit),
        [eventShow, eventCreate, eventEdit],
    );
    const defaultEventQuetionnaireActionProps = useMemo(
        () => defaultEventQuestionnaireProps<R>(reload, resourceToShowOrEdit),
        [resourceToShowOrEdit],
    );
    const handleSelectedDates = (dateInfo: { startStr: string; endStr: string }) =>
        setSelectedDates({
            calendarStart: formatFHIRDate(parseFHIRDate(dateInfo.startStr)),
            calendarEnd: formatFHIRDate(parseFHIRDate(dateInfo.endStr)),
        });

    return {
        eventResponse,
        reload,
        eventCreate,
        eventShow,
        eventEdit,
        questionnaireActions,
        defaultEventQuetionnaireActionProps,
        handleSelectedDates,
        selectedDates,
    };
}
