import { useService } from 'aidbox-react/lib/hooks/service';
import { extractBundleResources, getFHIRResources } from 'aidbox-react/lib/services/fhir';
import { mapSuccess } from 'aidbox-react/lib/services/service';

import { Practitioner, PractitionerRole } from 'shared/src/contrib/aidbox';
import { renderHumanName } from 'shared/src/utils/fhir';

import { formatHumanDate } from 'src/utils/date';

export function usePractitionersList() {
    const [practitionerDataListRD] = useService(async () => {
        const response = await getFHIRResources<PractitionerRole | Practitioner>(
            'PractitionerRole',
            {
                _include: ['PractitionerRole:practitioner'],
            },
        );

        return mapSuccess(response, (bundle) => {
            const sourceMap = extractBundleResources(bundle);
            const practitioners = sourceMap.Practitioner;
            const practitionerRoles = sourceMap.PractitionerRole;

            return practitioners.map((practitioner) => {
                const practitionerRoleList = practitionerRoles.filter(
                    (pR) => pR.practitioner!.id === practitioner.id,
                );

                return {
                    key: practitioner.id,
                    id: practitioner.id,
                    practitionerName: renderHumanName(practitioner.name?.[0]),
                    practitionerRoleList: practitionerRoleList
                        .map((pR) => {
                            return pR.specialty?.[0].coding?.[0].display;
                        })
                        .join(', '),
                    practitionerCreatedDate: formatHumanDate(
                        practitionerRoleList[0].meta?.createdAt as string,
                    ),
                };
            });
        });
    });
    return practitionerDataListRD;
}
