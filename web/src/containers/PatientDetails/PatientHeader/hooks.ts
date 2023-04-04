import { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { PatientHeaderContext } from './context';

export function usePatientHeaderLocationTitle(config: { title: string }) {
    const { setBreadcrumbs } = useContext(PatientHeaderContext);
    const { title } = config;
    const location = useLocation();

    useEffect(() => {
        setBreadcrumbs({ [location?.pathname]: title });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [title]);
}
