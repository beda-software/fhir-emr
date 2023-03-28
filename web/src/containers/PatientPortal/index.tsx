import { Navigate, Route, Routes } from 'react-router-dom';

import { sharedAppleIdentityToken } from 'src/sharedState';

import { Wearables } from './Wearables';

export function PatientPortal() {
    const [identityToken] = sharedAppleIdentityToken.useSharedState();

    if (!identityToken) {
        return <Navigate to="/signin" />;
    }

    return (
        <Routes>
            <Route path="/wearables" element={<Wearables />} />
            <Route path="*" element={<Navigate to="/wearables" />} />
        </Routes>
    );
}
