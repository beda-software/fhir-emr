import { renderHook, waitFor } from '@testing-library/react';

import { isSuccess } from '@beda.software/remote-data';

import { restoreUserSession } from 'src/containers/App/utils.ts';
import { useSmartApps } from 'src/containers/PatientDetails/PatientApps/hooks.ts';
import { initialSetup } from 'src/containers/PatientList/__tests__/utils.ts';

async function renderSmartAppsHook() {
    const { result } = renderHook(() => useSmartApps());
    return result;
}

describe('useSmartApps', () => {
    test('Retrieve list of smart apps for Practitioner role', async () => {
        const data = await initialSetup();
        await restoreUserSession(data.token);
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
