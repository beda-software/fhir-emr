import { renderHook, waitFor } from '@testing-library/react';
import { Organization } from 'fhir/r4b';

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
    return ensureSave({
        resourceType: 'Client',
        type: clientType,
        name: `${role} SmartForms`,
        description: `${role} Smart Forms App`,
        grant_types: ['authorization_code']
    });
}

async function initialSetup(role: Role) {
    const data = await dataSetup(role);
    await login({ ...data.user, password: 'password' });
    const client = await withRootAccess(axiosInstance, async () => {
        return await createClient(role);
    });
    return { ...data, client };
}

function dataSetup(role: Role) {
    return withRootAccess(axiosInstance, async () => {
        let resource;
        let resourceType;
        switch (role) {
            case Role.Patient:
                resource = await createPatient();
                resourceType = 'Patient';
                break;
            case Role.Practitioner:
                resource = await createPractitioner();
                resourceType = 'Practitioner';
                break;
            case Role.Admin:
                resource = await createAdmin();
                resourceType = 'Organization';
                break;
            case Role.Receptionist:
                resource = await createPractitioner();
                resourceType = 'Practitioner';
                break;
        }

        const user = await createUser({
            password: 'password',
            resourceType: 'User',
            email: role + '@beda.software',
        });
        const links: any = {};
        if (role === Role.Patient) {
            links.patient = {
                id: resource.id,
                resourceType: resourceType,
            };
        } else if (role === Role.Practitioner || role === Role.Receptionist) {
            links.practitioner = {
                id: resource.id,
                resourceType: resourceType,
            };
        } else if (role === Role.Admin) {
            links.organization = {
                id: resource.id,
                resourceType: resourceType,
            };
        }
        const roleData = await ensureSave({
            name: role,
            user: {
                id: user.id!,
                resourceType: 'User',
            },
            links: links,
            resourceType: 'Role',
        });

        return {
            user,
            role: roleData,
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

        const remoteData = result.current.appsRemoteData.data;
        const resourceType = matchCurrentUserRole<string>({
            [Role.Patient]: () => 'smart-on-fhir-patient',
            [Role.Admin]: () => 'smart-on-fhir',
            [Role.Practitioner]: () => 'smart-on-fhir-practitioner',
            [Role.Receptionist]: () => 'smart-on-fhir-practitioner',
        });
        expect(resourceType).toBe(remoteData.Client[0].type);
    });
});