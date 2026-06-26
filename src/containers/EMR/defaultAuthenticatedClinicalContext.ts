import { ParametersParameter } from 'fhir/r4b';

import { getResourceClinicalContext } from 'src/utils/clinicalContext';
import { selectCurrentUserRoleResource } from 'src/utils/role';

export function getAuthenticatedClinicalContextDefault(): ParametersParameter[] {
    const userRoleResource = selectCurrentUserRoleResource();

    return [
        ...getResourceClinicalContext('User', userRoleResource),
        ...getResourceClinicalContext(userRoleResource.resourceType, userRoleResource),
        ...getResourceClinicalContext('Author', userRoleResource),
    ];
}
