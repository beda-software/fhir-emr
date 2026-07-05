import { Parameters } from 'fhir/r4b';
import { useMemo } from 'react';

import { ServiceManager, useService } from '@beda.software/fhir-react';
import { mapSuccess, RemoteData } from '@beda.software/remote-data';

import { aidboxService, service } from 'src/services/fhir';

type ViewChartRunParameter = NonNullable<Parameters['parameter']>[number];

export type ViewChartDataSource = { kind: 'view'; view: string } | { kind: 'query'; query: string };

export interface UseViewChartRowsOptions<TRow> {
    parameters?: ViewChartRunParameter[];
    sort?: (a: TRow, b: TRow) => number;
}

function toQueryParams(parameters: ViewChartRunParameter[]): Record<string, string | number> {
    const params: Record<string, string | number> = {};
    for (const parameter of parameters) {
        const value =
            parameter.valueString ??
            parameter.valueCode ??
            parameter.valueInteger ??
            parameter.valueDecimal ??
            parameter.valueReference?.reference;
        if (value != null) {
            params[parameter.name] = value;
        }
    }
    return params;
}

export function useViewChartRows<TRow>(
    source: ViewChartDataSource,
    options: UseViewChartRowsOptions<TRow> = {},
): [RemoteData<TRow[]>, ServiceManager<TRow[], unknown>] {
    const { parameters = [], sort } = options;
    const parametersKey = JSON.stringify(parameters);

    const [remoteData, manager] = useService<TRow[]>(async () => {
        switch (source.kind) {
            case 'query': {
                const response = await aidboxService<{ data: TRow[] }>({
                    method: 'GET',
                    url: `/$query/${source.query}`,
                    params: toQueryParams(parameters),
                });

                return mapSuccess(response, (result) => result.data ?? []);
            }
            case 'view':
                return service<TRow[]>({
                    method: 'POST',
                    url: `/ViewDefinition/${source.view}/$run`,
                    data: {
                        resourceType: 'Parameters',
                        parameter: [...parameters, { name: '_format', valueCode: 'json' }],
                    },
                });
        }
    }, [source.kind, source.kind === 'view' ? source.view : source.query, parametersKey]);

    const sortedRemoteData = useMemo(
        () => (sort ? mapSuccess(remoteData, (rows) => [...rows].sort(sort)) : remoteData),
        [remoteData, sort],
    );

    return [sortedRemoteData, manager];
}
