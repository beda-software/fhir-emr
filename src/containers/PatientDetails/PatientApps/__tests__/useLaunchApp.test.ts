import { renderHook, act } from '@testing-library/react';
import { Patient } from 'fhir/r4b';
// eslint-disable-next-line import/named
import { Mock } from 'vitest';

import { Client } from '@beda.software/aidbox-types';

import { useLaunchApp } from 'src/containers/PatientDetails/PatientApps';
import { launch, LaunchProps } from 'src/containers/PatientDetails/PatientApps/hooks.ts';
import { selectCurrentUserRoleResource } from 'src/utils/role.ts';

vi.mock('src/utils/role', () => ({
    selectCurrentUserRoleResource: vi.fn(),
}));
vi.mock('src/containers/PatientDetails/PatientApps/hooks', () => ({
    launch: vi.fn(),
}));

describe('useLaunchApp', () => {
    const mockPatient: Patient = {
        resourceType: 'Patient',
        id: 'patient_id',
    };

    const mockApp: Client = {
        resourceType: 'Client',
        id: 'client_id',
    };

    test('launches app with regular user', () => {
        const mockUser = {
            id: 'user_id',
            resourceType: 'User',
        };
        (selectCurrentUserRoleResource as Mock).mockReturnValue(mockUser);

        const { result } = renderHook(() => useLaunchApp({ app: mockApp, patient: mockPatient }));

        act(() => {
            result.current();
        });

        const expectedParams: LaunchProps = {
            client: 'client_id',
            user: 'user_id',
            patient: 'patient_id',
        };

        expect(launch).toHaveBeenCalledWith(expectedParams);
    });

    test('launches app with practitioner', () => {
        const mockPractitioner = {
            id: 'practitioner_id',
            resourceType: 'Practitioner',
        };
        (selectCurrentUserRoleResource as Mock).mockReturnValue(mockPractitioner);

        const { result } = renderHook(() => useLaunchApp({ app: mockApp, patient: mockPatient }));

        act(() => {
            result.current();
        });

        const expectedParams: LaunchProps = {
            client: 'client_id',
            user: 'practitioner_id',
            patient: 'patient_id',
            practitioner: 'practitioner_id',
        };

        expect(launch).toHaveBeenCalledWith(expectedParams);
    });
});
