import { Navigate, Route, Routes } from 'react-router-dom';

import { Wearables } from './Wearables';

export function PatientPortal() {
    return (
        <Routes>
            <Route path="wearables" element={<Wearables />} />
            <Route path="*" element={<Navigate to="wearables" />} />
        </Routes>
    );
}
