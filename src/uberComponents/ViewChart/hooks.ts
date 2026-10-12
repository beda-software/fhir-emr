import { Parameters, Reference } from 'fhir/r4b';
import { useMemo } from 'react';

import { parseFHIRReference, ServiceManager, useService } from '@beda.software/fhir-react';
import { mapSuccess, RemoteData } from '@beda.software/remote-data';

import { aidboxService, service } from 'src/services/fhir';

type ViewChartRunParameter = NonNullable<Parameters['parameter']>[number];

export type ViewChartDataSource = Reference & {
    reference: string;
    type: 'AidboxQuery' | 'ViewDefinition' | 'Library';
};

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
        const { id } = parseFHIRReference(source);
        switch (source.type) {
            case 'AidboxQuery': {
                const response = await aidboxService<{ data: TRow[] }>({
                    method: 'GET',
                    url: `/$query/${id}`,
                    params: toQueryParams(parameters),
                });

                return mapSuccess(response, (result) => result.data ?? []);
            }
            case 'ViewDefinition':
                return service<TRow[]>({
                    method: 'POST',
                    url: `/ViewDefinition/${id}/$run`,
                    data: {
                        resourceType: 'Parameters',
                        parameter: [...parameters, { name: '_format', valueCode: 'json' }],
                    },
                });
            case 'Library':
                // https://build.fhir.org/ig/HL7/sql-on-fhir/OperationDefinition-SQLQueryRun.html
                // the query's own parameters must be nested inside the `parameters` input parameter.
                return service<TRow[]>({
                    method: 'POST',
                    url: `/Library/${id}/$sqlquery-run`,
                    data: {
                        resourceType: 'Parameters',
                        parameter: [
                            { name: '_format', valueCode: 'json' },
                            {
                                name: 'parameters',
                                resource: {
                                    resourceType: 'Parameters',
                                    parameter: parameters,
                                },
                            },
                        ],
                    },
                });
        }
    }, [source.type, source.reference, parametersKey]);

    const sortedRemoteData = useMemo(
        () => (sort ? mapSuccess(remoteData, (rows) => [...rows].sort(sort)) : remoteData),
        [remoteData, sort],
    );

    return [sortedRemoteData, manager];
}
