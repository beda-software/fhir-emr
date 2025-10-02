import { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { PatientHeaderContext } from './context';

/**
 * @deprecated
 */
export function usePatientHeaderLocationTitle(config: { title: string }) {
    console.warn(
        'DEPRECATED: Do not use usePatientHeaderLocationTitle hook. It will be removed in future versions of the EMR.',
    );

    const { setBreadcrumbs } = useContext(PatientHeaderContext);
    const { title } = config;
    const location = useLocation();

    useEffect(() => {
        setBreadcrumbs?.({ [location?.pathname]: title });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [title]);
}
