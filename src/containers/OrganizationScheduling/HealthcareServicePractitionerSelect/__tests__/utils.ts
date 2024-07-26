import { Practitioner, PractitionerRole } from 'fhir/r4b';

import { User } from '@beda.software/aidbox-types';
import { ensure, getReference, withRootAccess } from '@beda.software/fhir-react';

import { axiosInstance, createFHIRResource } from 'src/services/fhir';
import { createHealthcareService, createPractitioner, ensureSave, login } from 'src/setupTests';
import { renderHumanName } from 'src/utils/fhir';

import { SelectOption } from '../types';

export function dataSetup() {
    const data = withRootAccess(axiosInstance, async () => {
        const practitioner = await createPractitioner({
            name: [
                {
                    given: ['Basic-1'],
                    family: 'Practitioner',
                },
            ],
        });
        const practitioner2 = await createPractitioner({
            name: [
                {
                    given: ['Basic-2'],
                    family: 'Practitioner',
                },
            ],
        });
        const user = await createUser({
            fhirUser: {
                id: practitioner.id!,
                resourceType: 'Practitioner',
            },
            password: 'password',
            resourceType: 'User',
            email: 'test@beda.software',
        });
        const role = await ensureSave({
            name: 'practitioner',
            user: {
                id: user.id!,
                resourceType: 'User',
            },
            links: {
                practitioner: {
                    id: practitioner.id,
                    resourceType: 'Practitioner',
                },
            },
            resourceType: 'Role',
        });
        const hs1 = await createHealthcareService({
            type: [
                {
                    text: 'The first appointment',
                    coding: [
                        {
                            code: 'consultation',
                            system: 'http://beda.software/custom-healthcare-service-list',
                            display: 'The first appointment',
                        },
                    ],
                },
            ],
            name: 'The first appointment',
        });

        const hs2 = await createHealthcareService({
            type: [
                {
                    text: 'The second appointment',
                    coding: [
                        {
                            code: 'consultation-2',
                            system: 'http://beda.software/custom-healthcare-service-list',
                            display: 'The second appointment',
                        },
                    ],
                },
            ],
            name: 'The second appointment',
        });

        const pr1 = await createPractitionerRole({
            code: [
                {
                    coding: [
                        {
                            code: 'doctor',
                            system: 'http://terminology.hl7.org/CodeSystem/practitioner-role',
                            display: 'Doctor',
                        },
                    ],
                },
            ],
            practitioner: getReference(practitioner),
            healthcareService: [getReference(hs1)],
        });

        const pr2 = await createPractitionerRole({
            code: [
                {
                    coding: [
                        {
                            code: 'doctor',
                            system: 'http://terminology.hl7.org/CodeSystem/practitioner-role',
                            display: 'Doctor',
                        },
                    ],
                },
            ],
            practitioner: getReference(practitioner2),
            healthcareService: [getReference(hs2)],
        });

        return {
            user,
            role,
            practitioner,
            practitioners: [practitioner, practitioner2],
            practitionerRoles: [pr1, pr2],
            healthcareServices: [hs1, hs2],
        };
    });

    return data;
}

async function createUser(userData: Partial<User>) {
    return ensure(
        await createFHIRResource<User>({
            resourceType: 'User',
            ...userData,
        }),
    );
}

async function createPractitionerRole(practitionerRoleData: Partial<PractitionerRole>) {
    return ensure(
        await createFHIRResource<PractitionerRole>({
            resourceType: 'PractitionerRole',
            ...practitionerRoleData,
        }),
    );
}

export async function initialSetup() {
    const data = await dataSetup();
    await login({ ...data.user, password: 'password' });

    return data;
}

export function optionExistInOptionList(optionList: SelectOption[], targetList: SelectOption): boolean {
    return optionList.some((dict) => JSON.stringify(dict) === JSON.stringify(targetList));
}

export function getPractitionerRoleNamesMapping(practitionerRoles: PractitionerRole[], practitioners: Practitioner[]) {
    return practitionerRoles.map((pr) => {
        const currentPractitioner = practitioners.find((p) => p.id === pr.practitioner?.reference?.split('/')[1]);
        return {
            id: pr.id,
            name: renderHumanName(currentPractitioner?.name?.[0]),
        };
    });
}
