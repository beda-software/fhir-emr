import { renderHook, waitFor } from '@testing-library/react';

import { withRootAccess } from '@beda.software/fhir-react';
import { isSuccess } from '@beda.software/remote-data';

import { useSmartApps } from 'src/containers/PatientDetails/PatientApps/hooks.ts';
import { createUser } from 'src/containers/PatientList/__tests__/utils.ts';
import { axiosInstance } from 'src/services/fhir.ts';
import { createPractitioner, ensureSave, login } from 'src/setupTests.ts';
import { Role } from 'src/utils/role.ts';

async function renderSmartAppsHook() {
    const { result } = renderHook(() => useSmartApps());
    return result;
}

async function initialSetup(role: Role) {
    const data = await dataSetup(role);
    const token = await login({ ...data.user, password: 'password' });
    data.token = token.access_token;
    return data;
}

function dataSetup(role: Role) {
    return withRootAccess(axiosInstance, async () => {
        const practitioner1 = await createPractitioner();
        const user = await createUser({
            password: 'password',
            resourceType: 'User',
            email: role + '@beda.software',
        });
        const roleData = await ensureSave({
            name: role,
            user: {
                id: user.id!,
                resourceType: 'User',
            },
            links: {
                practitioner: {
                    id: practitioner1.id,
                    resourceType: role.charAt(0).toUpperCase() + role.slice(1),
                },
            },
            resourceType: 'Role',
        });
        const token = '';

        return {
            user,
            role: roleData,
            practitioner: practitioner1,
            token,
        };
    });
}

describe.each(Object.values(Role))('useSmartApps for role %s', (role) => {
    test(`Retrieve list of smart apps for ${role} role`, async () => {
        await initialSetup(role as Role);
        const result = await renderSmartAppsHook();
        await waitFor(
            () => {
                expect(isSuccess(result.current.appsRemoteData)).toBeTruthy();
            },
            { timeout: 30000 },
        );

        expect(result.current.appsRemoteData.status).toBe('Success');
    });
});
