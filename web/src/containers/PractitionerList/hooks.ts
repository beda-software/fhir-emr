import { useService } from 'aidbox-react/lib/hooks/service';
import { extractBundleResources, getFHIRResources } from 'aidbox-react/lib/services/fhir';
import { mapSuccess } from 'aidbox-react/lib/services/service';

import { Practitioner, PractitionerRole } from 'shared/src/contrib/aidbox';
import { renderHumanName } from 'shared/src/utils/fhir';

export interface PractitionerListRowData {
    key: string;
    id: string;
    practitionerResource: Practitioner;
    practitionerName: string;
    practitionerRoleList: Array<string>;
    practitionerRolesList: PractitionerRole[];
    practitionerRolesResource: Array<any>;
}

export function usePractitionersList() {
    const [practitionerDataListRD, manager] = useService<PractitionerListRowData[]>(async () => {
        const response = await getFHIRResources<PractitionerRole | Practitioner>(
            'PractitionerRole',
            {
                _include: ['PractitionerRole:practitioner:Practitioner'],
            },
        );

        return mapSuccess(response, (bundle) => {
            const sourceMap = extractBundleResources(bundle);
            const practitioners = sourceMap.Practitioner;
            const practitionerRoles = sourceMap.PractitionerRole;

            return practitioners.map((practitioner) => {
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
                    practitionerRolesList: practitionerRoles,
                };
                return rowData;
            });
        });
    });
    return { practitionerDataListRD, practitionerListReload: manager.reload };
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
