import type { ReactNode } from 'react';
import type {
    AreaProps,
    BarProps,
    CartesianGridProps,
    LegendProps,
    LineProps,
    TooltipValueType,
    TooltipProps,
    XAxisProps,
    YAxisProps,
} from 'recharts';
import type { AxisDomain } from 'recharts/types/util/types';

import type { RemoteData } from '@beda.software/remote-data';

export type ChartVariant = 'bar' | 'area' | 'bar+line';

export interface ChartDatumBase {
    x: string;
    y: number;
    yLine?: number;
}

export interface ChartMargin {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
}

export type ChartXAxisProps = Partial<Pick<XAxisProps, 'tickMargin' | 'minTickGap' | 'interval'>>;

export type ChartYAxisProps = Partial<Pick<YAxisProps, 'width' | 'tickMargin' | 'interval'>>;

export type ChartGridProps = Partial<
    Pick<CartesianGridProps, 'horizontal' | 'vertical' | 'stroke' | 'strokeWidth' | 'strokeDasharray'>
>;

export type ChartLegendProps = Partial<Pick<LegendProps, 'align' | 'verticalAlign' | 'iconSize' | 'wrapperStyle'>>;

export type ChartTooltipProps = Partial<
    Pick<
        TooltipProps<TooltipValueType, string | number>,
        | 'content'
        | 'cursor'
        | 'formatter'
        | 'labelFormatter'
        | 'wrapperStyle'
        | 'contentStyle'
        | 'itemStyle'
        | 'labelStyle'
        | 'allowEscapeViewBox'
    >
>;

export type ChartBarProps = Partial<
    Pick<BarProps, 'fill' | 'radius' | 'maxBarSize' | 'opacity' | 'name' | 'minPointSize'>
>;

export type ChartLineProps = Partial<
    Pick<LineProps, 'stroke' | 'strokeWidth' | 'dot' | 'activeDot' | 'type' | 'connectNulls' | 'name'>
>;

export type ChartAreaProps = Partial<
    Pick<
        AreaProps<any, any>,
        'stroke' | 'strokeWidth' | 'fill' | 'fillOpacity' | 'dot' | 'activeDot' | 'type' | 'connectNulls' | 'name'
    >
>;

export interface ChartProps<TDatum extends ChartDatumBase = ChartDatumBase> {
    variant: ChartVariant;
    data: TDatum[];
    yDomain: AxisDomain;
    yTicks?: number[];
    yTickFormatter?: (n: number) => string;
    yLineDomain?: AxisDomain;
    yLineTicks?: number[];
    yLineTickFormatter?: (n: number) => string;
    onPointClick?: (datum: TDatum) => void;
    empty?: ReactNode;
    height?: number;
    margin?: ChartMargin;
    xAxisProps?: ChartXAxisProps;
    yAxisProps?: ChartYAxisProps;
    yLineAxisProps?: ChartYAxisProps;
    gridProps?: ChartGridProps;
    legendProps?: ChartLegendProps;
    tooltipProps?: ChartTooltipProps;
    barProps?: ChartBarProps;
    lineProps?: ChartLineProps;
    areaProps?: ChartAreaProps;
}

export interface ChartCardProps<TRow, TDatum extends ChartDatumBase = ChartDatumBase>
    extends Omit<ChartProps<TDatum>, 'data'> {
    title: ReactNode;
    icon?: ReactNode;
    rows: RemoteData<TRow[]>;
    transform: (rows: TRow[]) => TDatum[];
    loading?: ReactNode;
    failure?: (error: unknown) => ReactNode;
}
