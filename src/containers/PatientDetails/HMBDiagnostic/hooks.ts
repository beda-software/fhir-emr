import { useMemo } from 'react';

import { useViewDefinitionRows } from 'src/hooks';

import { HMBResponseRow } from './types';

const sortByAuthoredAsc = (a: HMBResponseRow, b: HMBResponseRow) => a.authored.localeCompare(b.authored);

export function useHMBResponses(patientId?: string) {
    const parameters = useMemo(
        () => (patientId ? [{ name: 'patient', valueReference: { reference: `Patient/${patientId}` } }] : []),
        [patientId],
    );

    return useViewDefinitionRows<HMBResponseRow>('hmb-screening-responses', {
        parameters,
        enabled: !!patientId,
        sort: sortByAuthoredAsc,
    });
}
