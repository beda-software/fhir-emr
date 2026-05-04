import { useMemo } from 'react';

import { useViewDefinitionRows } from 'src/hooks';

import { HMBResponseRow } from './types';

const HMB_VIEW_ID = 'hmb-screening-responses';

const sortByAuthoredAsc = (a: HMBResponseRow, b: HMBResponseRow) => a.authored.localeCompare(b.authored);

export function useHMBResponses(patientId?: string) {
    const parameters = useMemo(
        () => (patientId ? [{ name: 'patient', valueReference: { reference: `Patient/${patientId}` } }] : []),
        [patientId],
    );

    return useViewDefinitionRows<HMBResponseRow>(HMB_VIEW_ID, {
        parameters,
        enabled: !!patientId,
        sort: sortByAuthoredAsc,
    });
}
