import { useService } from 'aidbox-react/lib/hooks/service';
import { isSuccess, success } from 'aidbox-react/lib/libs/remoteData';
import { extractBundleResources, getFHIRResources } from 'aidbox-react/lib/services/fhir';
import { mapSuccess } from 'aidbox-react/lib/services/service';

import { Practitioner, PractitionerRole } from 'shared/src/contrib/aidbox';
import { renderHumanName } from 'shared/src/utils/fhir';

import { StringTypeColumnFilterValue } from 'src/components/SearchBar/types';
import { useDebounce } from 'src/utils/debounce';

import { usePagerExtended } from '../EncounterList/hooks';

export interface PractitionerListRowData {
    key: string;
    id: string;
    practitionerResource: Practitioner;
    practitionerName: string;
    practitionerRoleList: Array<string>;
    practitionerRolesResource: Array<any>;
}

export function usePractitionersList(filterValues: StringTypeColumnFilterValue[]) {
    const debouncedFilterValues = useDebounce(filterValues, 300);

    const practitionerFilterValue = debouncedFilterValues[0];

    const queryParameters = {
        _sort: '-_lastUpdated',
        ...(practitionerFilterValue ? { name: practitionerFilterValue.value } : {}),
    };

    const { resourceResponse, pagerManager, handleTableChange, pagination } = usePagerExtended<
        Practitioner,
        StringTypeColumnFilterValue[]
    >('Practitioner', queryParameters, debouncedFilterValues);

    const [practitionerDataListRD] = useService<PractitionerListRowData[]>(async () => {
        const practitionersResponse = mapSuccess(
            resourceResponse,
            (bundle) => extractBundleResources(bundle).Practitioner,
        );
        const practitioners = isSuccess(practitionersResponse) ? practitionersResponse.data : [];

        const filteredResourcesAreFound = !practitionerFilterValue || practitioners.length > 0;

        const response = filteredResourcesAreFound
            ? await getFHIRResources<PractitionerRole | Practitioner>('PractitionerRole', {
                  _include: ['PractitionerRole:practitioner:Practitioner'],
                  practitioner: practitioners.map((practitioner) => practitioner.id).join(','),
              })
            : success(undefined);

        return mapSuccess(response, (bundle) => {
            const sourceMap = bundle
                ? extractBundleResources(bundle)
                : { Practitioner: [], PractitionerRole: [] };

            const practitioners = sourceMap.Practitioner;
            const practitionerRoles = sourceMap.PractitionerRole;

            return practitioners
                .map((practitioner) => {
                    const practitionerRolesList = practitionerRoles.filter(
                        (pR) => pR.practitioner?.id === practitioner.id,
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
                })
                .reverse();
        });
    }, [debouncedFilterValues, resourceResponse]);

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
        const pRL = pR.specialty?.[0]!.coding?.[0]!.display;
        if (pRL !== undefined) {
            practitionerSpecialtyList.push(pRL);
        }
    });
    return practitionerSpecialtyList;
}
