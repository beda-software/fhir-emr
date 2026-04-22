import type { ReactNode } from 'react';
import type {
    AreaProps as RechartsAreaProps,
    BarProps as RechartsBarProps,
    CartesianGridProps,
    LegendProps,
    LineProps as RechartsLineProps,
    TooltipValueType,
    TooltipProps,
    XAxisProps,
    YAxisProps,
} from 'recharts';
import type { AxisDomain } from 'recharts/types/util/types';

import type { RemoteData } from '@beda.software/remote-data';

export type ChartVariant = 'bar' | 'area' | 'bar+line';

export type ChartNumericValue = number | null | undefined;

export interface ChartDatumBase {
    /** Category/date label rendered on the x-axis. */
    x: string;
    /** Optional full label rendered in the tooltip title. Falls back to `x` when absent. */
    xTooltipLabel?: string;
    /** Main series value. Used by bars and areas, and by the left axis in bar+line charts. */
    y: ChartNumericValue;
    /** Secondary line value. Used only by the right axis in bar+line charts. */
    yLine?: ChartNumericValue;
}

export interface ChartMargin {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
}

export type ChartXAxisProps = Partial<Pick<XAxisProps, 'tickMargin' | 'minTickGap' | 'interval' | 'tickFormatter'>>;

export type ChartYAxisProps = Partial<Pick<YAxisProps, 'width' | 'tickMargin' | 'interval' | 'tick' | 'axisLine'>>;

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

export type ChartBarSeriesProps = Partial<
    Pick<RechartsBarProps, 'fill' | 'radius' | 'maxBarSize' | 'opacity' | 'name' | 'minPointSize'>
>;

export type ChartLineSeriesProps = Partial<
    Pick<RechartsLineProps, 'stroke' | 'strokeWidth' | 'dot' | 'activeDot' | 'type' | 'connectNulls' | 'name'>
>;

export type ChartAreaSeriesProps = Partial<
    Pick<
        RechartsAreaProps<unknown, unknown>,
        'stroke' | 'strokeWidth' | 'fill' | 'fillOpacity' | 'dot' | 'activeDot' | 'type' | 'connectNulls' | 'name'
    >
>;

interface ChartBaseProps<TDatum extends ChartDatumBase = ChartDatumBase> {
    /** Rows already transformed to the chart's x/y/yLine data shape. */
    data: TDatum[];
    /** Called with the datum under the active tooltip when the chart surface is clicked. */
    onPointClick?: (datum: TDatum) => void;
    /** Optional content rendered instead of an empty chart when data has no rows. */
    empty?: ReactNode;
    /** ResponsiveContainer height in pixels. Defaults to 340. */
    height?: number;
    /** Margin passed to Recharts ComposedChart. Defaults leave room for right-axis labels. */
    margin?: ChartMargin;
    /** x-axis display overrides. The data key is always `x`. */
    xAxisProps?: ChartXAxisProps;
    /** Left y-axis display overrides. The data key is `y`. */
    yAxisProps?: ChartYAxisProps;
    /** Cartesian grid display overrides. */
    gridProps?: ChartGridProps;
    /** Tooltip overrides. Use formatter/labelFormatter for value labels. */
    tooltipProps?: ChartTooltipProps;
}

interface ChartPrimaryYAxisProps {
    /** Left y-axis domain for the `y` data key. Defaults to Recharts auto domain. */
    yDomain?: AxisDomain;
    /** Left y-axis tick values for the `y` data key. */
    yTicks?: number[];
    /** Left y-axis tick label formatter for the `y` data key. */
    yTickFormatter?: (n: number) => string;
}

interface ChartLineYAxisProps {
    /** Right y-axis domain for the `yLine` data key. Used only by `bar+line`. */
    yLineDomain?: AxisDomain;
    /** Right y-axis tick values for the `yLine` data key. Used only by `bar+line`. */
    yLineTicks?: number[];
    /** Right y-axis tick label formatter for the `yLine` data key. Used only by `bar+line`. */
    yLineTickFormatter?: (n: number) => string;
    /** Right y-axis display overrides. Used only by `bar+line`. */
    yLineAxisProps?: ChartYAxisProps;
}

export interface ChartBarProps<TDatum extends ChartDatumBase = ChartDatumBase>
    extends ChartBaseProps<TDatum>,
        ChartPrimaryYAxisProps {
    /** Renders one bar series from the `y` data key. */
    variant: 'bar';
    /** Bar series overrides. The data key is always `y`. */
    barProps?: ChartBarSeriesProps;
    areaProps?: never;
    lineProps?: never;
    legendProps?: never;
    yLineDomain?: never;
    yLineTicks?: never;
    yLineTickFormatter?: never;
    yLineAxisProps?: never;
}

export interface ChartAreaProps<TDatum extends ChartDatumBase = ChartDatumBase>
    extends ChartBaseProps<TDatum>,
        ChartPrimaryYAxisProps {
    /** Renders one area series from the `y` data key. */
    variant: 'area';
    /** Area series overrides. The data key is always `y`. */
    areaProps?: ChartAreaSeriesProps;
    barProps?: never;
    lineProps?: never;
    legendProps?: never;
    yLineDomain?: never;
    yLineTicks?: never;
    yLineTickFormatter?: never;
    yLineAxisProps?: never;
}

export interface ChartBarLineProps<TDatum extends ChartDatumBase = ChartDatumBase>
    extends ChartBaseProps<TDatum>,
        ChartPrimaryYAxisProps,
        ChartLineYAxisProps {
    /** Renders bars from `y` plus a line from `yLine`. */
    variant: 'bar+line';
    /** Legend overrides. Rendered only for `bar+line`. */
    legendProps?: ChartLegendProps;
    /** Bar series overrides. The data key is always `y`. */
    barProps?: ChartBarSeriesProps;
    /** Line series overrides. The data key is always `yLine`. */
    lineProps?: ChartLineSeriesProps;
    areaProps?: never;
}

export type ChartProps<TDatum extends ChartDatumBase = ChartDatumBase> =
    | ChartBarProps<TDatum>
    | ChartAreaProps<TDatum>
    | ChartBarLineProps<TDatum>;

export interface ChartConfigProps<TDatum extends ChartDatumBase = ChartDatumBase>
    extends ChartBaseProps<TDatum>,
        ChartPrimaryYAxisProps,
        ChartLineYAxisProps {
    /** Selects which series are rendered and which prop groups are meaningful. */
    variant: ChartVariant;
    /** Legend overrides. Rendered only for `bar+line`. */
    legendProps?: ChartLegendProps;
    /** Bar series overrides. Used by `bar` and `bar+line`. The data key is always `y`. */
    barProps?: ChartBarSeriesProps;
    /** Line series overrides. Used only by `bar+line`. The data key is always `yLine`. */
    lineProps?: ChartLineSeriesProps;
    /** Area series overrides. Used only by `area`. The data key is always `y`. */
    areaProps?: ChartAreaSeriesProps;
}

export type ChartCardProps<TRow, TDatum extends ChartDatumBase = ChartDatumBase> = Omit<
    ChartConfigProps<TDatum>,
    'data'
> & {
    /** Card title rendered above the chart. */
    title: ReactNode;
    /** Card icon rendered near the title. */
    icon?: ReactNode;
    /** Uses compact icon spacing in DashboardCard. Defaults to true. */
    compactIcon?: boolean;
    /** Remote data source before chart transformation. */
    rows: RemoteData<TRow[]>;
    /** Converts loaded rows into the Chart x/y/yLine data shape. */
    transform: (rows: TRow[]) => TDatum[];
};
