import { Practitioner, PractitionerRole } from 'fhir/r4b';

import { WithId, extractBundleResources, parseFHIRReference, useService } from '@beda.software/fhir-react';
import { isSuccess, mapSuccess, success } from '@beda.software/remote-data';

import { ColumnFilterValue } from 'src/components/SearchBar/types';
import { getSearchBarFilterValue } from 'src/components/SearchBar/utils';
import { usePagerExtended } from 'src/hooks/pager';
import { getFHIRResources } from 'src/services/fhir';
import { useDebounce } from 'src/utils/debounce';
import { renderHumanName } from 'src/utils/fhir';

export interface PractitionerListRowData {
    key: string;
    id: string;
    practitionerResource: Practitioner;
    practitionerName: string;
    practitionerRoleList: Array<string>;
    practitionerRolesResource: Array<any>;
}

export function usePractitionersList(filterValues: ColumnFilterValue[] | undefined) {
    const debouncedFilterValues = useDebounce(filterValues, 300);

    const practitionerFilterValue = getSearchBarFilterValue(filterValues, 'practitioner');

    const queryParameters = {
        _sort: ['-_lastUpdated', '_id'],
        name: practitionerFilterValue,
    };

    const { resourceResponse, pagerManager, handleTableChange, pagination } = usePagerExtended<
        WithId<Practitioner>,
        ColumnFilterValue[]
    >('Practitioner', queryParameters, debouncedFilterValues);

    const [practitionerDataListRD] = useService<PractitionerListRowData[]>(async () => {
        const practitionersResponse = mapSuccess(
            resourceResponse,
            (bundle) => extractBundleResources(bundle).Practitioner,
        );
        const practitioners = isSuccess(practitionersResponse) ? practitionersResponse.data : [];

        const filteredResourcesAreFound = !practitionerFilterValue || practitioners.length > 0;

        const response = filteredResourcesAreFound
            ? await getFHIRResources<PractitionerRole>('PractitionerRole', {
                  practitioner: practitioners.map((practitioner) => practitioner.id).join(','),
              })
            : success(undefined);

        return mapSuccess(response, (bundle) => {
            const sourceMap = bundle ? extractBundleResources(bundle) : { Practitioner: [], PractitionerRole: [] };

            const practitionerRoles = sourceMap.PractitionerRole;

            return practitioners.map((practitioner) => {
                const practitionerRolesList = practitionerRoles.filter(
                    (pR) => pR.practitioner && parseFHIRReference(pR.practitioner).id === practitioner.id,
                );
                const rowData: PractitionerListRowData = {
                    key: practitioner.id,
                    id: practitioner.id,
                    practitionerResource: practitioner,
                    practitionerRolesResource: practitionerRolesList,
                    practitionerName: renderHumanName(practitioner.name?.[0]),
                    practitionerRoleList: practitionerRoleToStringArray(practitionerRolesList),
                };
                return rowData;
            });
        });
    }, [resourceResponse]);

    return {
        practitionerDataListRD,
        practitionerListReload: pagerManager.reload,
        pagination,
        handleTableChange,
    };
}

function practitionerRoleToStringArray(practitionerRolesList: PractitionerRole[]): string[] {
    const practitionerSpecialtyList: string[] = [];
    practitionerRolesList.forEach((pR) => {
        const pRL = pR.specialty?.[0]?.coding?.[0]?.display;
        if (pRL !== undefined) {
            practitionerSpecialtyList.push(pRL);
        }
    });
    return practitionerSpecialtyList;
}
