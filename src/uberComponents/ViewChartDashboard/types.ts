import type { ObservationReferenceRange, Parameters } from 'fhir/r4b';
import type { ReactNode } from 'react';

import type { ChartConfigProps, ChartDatumBase } from 'src/components/Chart';

export type ViewDefinitionRunParameter = NonNullable<Parameters['parameter']>[number];

export type ViewChartConfig<TRow, TDatum extends ChartDatumBase = ChartDatumBase> = Omit<
    ChartConfigProps<TDatum>,
    'data' | 'onPointClick'
> & {
    transform: (rows: TRow[]) => TDatum[];
    title?: ReactNode;
};

export interface ReferenceChartRow {
    id: string;
    series: string;
    axis_label: string;
    title: string | null;
    reference_range: (ObservationReferenceRange | string)[] | null;
    value_code: string | null;
    value_integer: number | null;
    value_quantity: number | null;
}

export interface ReferenceChartOptions {
    severityFills?: Record<string, string>;
    fillOpacity?: number;
    formatValue?: (value: unknown) => string;
}

export interface ViewChartDashboardProps<TRow extends ReferenceChartRow> {
    viewDefinitionId: string;
    parameters?: ViewDefinitionRunParameter[];
    sort?: (a: TRow, b: TRow) => number;
    charts?: ViewChartConfig<TRow>[] | ((rows: TRow[]) => ViewChartConfig<TRow>[]);
    onPointClick?: (datum: ChartDatumBase) => void;
    renderChart?: (chart: ReactNode, config: ViewChartConfig<TRow>, index: number) => ReactNode;
    columns?: number;
    gap?: number | string;
}
