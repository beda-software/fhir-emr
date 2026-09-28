import { Parameters } from 'fhir/r4b';
import { useMemo } from 'react';

import { ServiceManager, useService } from '@beda.software/fhir-react';
import { mapSuccess, RemoteData, success } from '@beda.software/remote-data';

import { service } from 'src/services/fhir';

type ViewDefinitionRunParameter = NonNullable<Parameters['parameter']>[number];

export interface UseViewDefinitionRowsOptions<TRow> {
    parameters?: ViewDefinitionRunParameter[];
    enabled?: boolean;
    sort?: (a: TRow, b: TRow) => number;
}

export function useViewDefinitionRows<TRow>(
    viewDefinitionId: string,
    options: UseViewDefinitionRowsOptions<TRow> = {},
): [RemoteData<TRow[]>, ServiceManager<TRow[], unknown>] {
    const { parameters = [], enabled = true, sort } = options;
    const parametersKey = JSON.stringify(parameters);

    const [remoteData, manager] = useService<TRow[]>(async () => {
        if (!enabled) {
            return success<TRow[]>([]);
        }

        return service<TRow[]>({
            method: 'POST',
            url: `/ViewDefinition/${viewDefinitionId}/$run`,
            data: {
                resourceType: 'Parameters',
                parameter: [...parameters, { name: '_format', valueCode: 'json' }],
            },
        });
    }, [viewDefinitionId, enabled, parametersKey]);

    const sortedRemoteData = useMemo(
        () => (sort ? mapSuccess(remoteData, (rows) => [...rows].sort(sort)) : remoteData),
        [remoteData, sort],
    );

    return [sortedRemoteData, manager];
}
