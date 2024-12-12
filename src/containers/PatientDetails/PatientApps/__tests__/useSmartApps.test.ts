import { renderHook, waitFor } from '@testing-library/react';
import { Organization } from 'fhir/r4b';

import { Client, Role as AidboxRole } from '@beda.software/aidbox-types';
import { ensure, withRootAccess } from '@beda.software/fhir-react';
import { isSuccess } from '@beda.software/remote-data';

import { useSmartApps } from 'src/containers/PatientDetails/PatientApps/hooks.ts';
import { createUser } from 'src/containers/PatientList/__tests__/utils.ts';
import { axiosInstance, createFHIRResource } from 'src/services/fhir.ts';
import { createPatient, createPractitioner, ensureSave, login } from 'src/setupTests.ts';
import { matchCurrentUserRole, Role } from 'src/utils/role.ts';

async function renderSmartAppsHook() {
    const { result } = renderHook(() => useSmartApps());
    return result;
}

export async function createAdmin(organization: Partial<Organization> = {}) {
    return ensure(
        await createFHIRResource<Organization>({
            resourceType: 'Organization',
            ...organization,
        }),
    );
}

async function createClient(role: Role) {
    const clientType = matchCurrentUserRole<string>({
        [Role.Patient]: () => 'smart-on-fhir-patient',
        [Role.Admin]: () => 'smart-on-fhir',
        [Role.Practitioner]: () => 'smart-on-fhir-practitioner',
        [Role.Receptionist]: () => 'smart-on-fhir-practitioner',
    });
    return ensureSave<Client>({
        resourceType: 'Client',
        type: clientType,
        name: `${role} SmartForms`,
        description: `${role} Smart Forms App`,
        grant_types: ['authorization_code'],
    });
}

async function initialSetup(roleName: Role) {
    const { user, role } = await withRootAccess(axiosInstance, async () => {
        let resource;
        switch (roleName) {
            case Role.Patient:
                resource = await createPatient();
                break;
            case Role.Practitioner:
            case Role.Receptionist:
                resource = await createPractitioner();
                break;
            case Role.Admin:
                resource = await createAdmin();
                break;
        }

        const user = await createUser({
            resourceType: 'User',
            password: 'password',
            email: `${roleName}@beda.software`,
        });

        const links: AidboxRole['links'] = {};
        if (roleName === Role.Patient) {
            links.patient = {
                id: resource.id,
                resourceType: resource.resourceType as 'Patient',
            };
        } else if (roleName === Role.Practitioner || roleName === Role.Receptionist) {
            links.practitioner = {
                id: resource.id,
                resourceType: resource.resourceType as 'Practitioner',
            };
        } else if (roleName === Role.Admin) {
            links.organization = {
                id: resource.id,
                resourceType: resource.resourceType as 'Organization',
            };
        }
        const role = await ensureSave<AidboxRole>({
            resourceType: 'Role',
            name: roleName,
            user: {
                id: user.id!,
                resourceType: 'User',
            },
            links,
        });

        return { user, role };
    });

    await login({ ...user, password: 'password' });

    const client = await withRootAccess(axiosInstance, async () => {
        return await createClient(roleName);
    });

    return { user, role, client };
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

        if (isSuccess(result.current.appsRemoteData)) {
            const appData = result.current.appsRemoteData.data;
            const clientType = matchCurrentUserRole<string>({
                [Role.Patient]: () => 'smart-on-fhir-patient',
                [Role.Admin]: () => 'smart-on-fhir',
                [Role.Practitioner]: () => 'smart-on-fhir-practitioner',
                [Role.Receptionist]: () => 'smart-on-fhir-practitioner',
            });
            const firstClient = appData[0];
            if (!firstClient) {
                throw new Error('First client data is not available');
            }
            expect(clientType).toBe(firstClient.type);
        } else {
            throw new Error('appsRemoteData is not in Success state');
        }
    });
});
