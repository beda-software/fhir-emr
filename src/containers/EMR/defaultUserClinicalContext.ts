import { ParametersParameter } from 'fhir/r4b';

import { resourceToClinicalContext } from 'src/utils/clinicalContext';
import { selectCurrentUserRoleResource } from 'src/utils/role';

export function toUserClinicalContextDefault(): ParametersParameter[] {
    const userRoleResource = selectCurrentUserRoleResource();

    return [
        ...resourceToClinicalContext('User', userRoleResource),
        ...resourceToClinicalContext(userRoleResource.resourceType, userRoleResource),
        ...resourceToClinicalContext('Author', userRoleResource),
    ];
}
