import type { ChartProps, ChartTooltipProps } from './Chart.types';

export interface OrderedCategory<Key extends string> {
    key: Key;
    label: string;
}

export interface CategoricalAxis<Key extends string> {
    encode: (key: Key | null | undefined) => number | undefined;
    labelAt: (index: number | null | undefined) => string;
    chartProps: Pick<ChartProps, 'yDomain' | 'yTicks' | 'yTickFormatter'>;
    tooltipFormatter: NonNullable<ChartTooltipProps['formatter']>;
    tooltipFormatterForDataKey: (dataKey: string) => NonNullable<ChartTooltipProps['formatter']>;
}

export function createCategoricalAxis<Key extends string>(
    categories: readonly OrderedCategory<Key>[],
): CategoricalAxis<Key> {
    const byKey = new Map(categories.map((category, index) => [category.key, index] as const));
    const labels = categories.map((category) => category.label);
    const ticks = categories.map((_, index) => index);

    const labelAt = (index: number | null | undefined) => {
        if (index == null || !Number.isInteger(index)) {
            return '';
        }

        return labels[index] ?? '';
    };

    const formatValue = (value: unknown) => (typeof value === 'number' ? labelAt(value) : String(value ?? ''));

    const tooltipFormatter: NonNullable<ChartTooltipProps['formatter']> = (value) => formatValue(value);

    const tooltipFormatterForDataKey = (dataKey: string): NonNullable<ChartTooltipProps['formatter']> => {
        return (value, _name, item) => (item.dataKey === dataKey ? formatValue(value) : String(value ?? ''));
    };

    return {
        encode: (key) => (key != null ? byKey.get(key) : undefined),
        labelAt,
        chartProps: {
            yDomain: [0, categories.length - 1],
            yTicks: ticks,
            yTickFormatter: labelAt,
        },
        tooltipFormatter,
        tooltipFormatterForDataKey,
    };
}
