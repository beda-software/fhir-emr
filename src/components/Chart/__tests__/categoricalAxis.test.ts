import type { Payload, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { describe, expect, it } from 'vitest';

import { createCategoricalAxis } from '../categoricalAxis';

const tooltipItem = (dataKey?: string) => ({ dataKey }) as Payload<ValueType, string | number>;

describe('createCategoricalAxis', () => {
    const axis = createCategoricalAxis([
        { key: 'low', label: 'Low' },
        { key: 'medium', label: 'Medium' },
        { key: 'high', label: 'High' },
    ] as const);

    it('encodes known category keys by order', () => {
        expect(axis.encode('low')).toBe(0);
        expect(axis.encode('medium')).toBe(1);
        expect(axis.encode('high')).toBe(2);
    });

    it('returns undefined for missing category values', () => {
        expect(axis.encode(null)).toBeUndefined();
        expect(axis.encode(undefined)).toBeUndefined();
    });

    it('labels category indexes', () => {
        expect(axis.labelAt(0)).toBe('Low');
        expect(axis.labelAt(1)).toBe('Medium');
        expect(axis.labelAt(2)).toBe('High');
        expect(axis.labelAt(3)).toBe('');
        expect(axis.labelAt(null)).toBe('');
    });

    it('creates categorical chart props', () => {
        expect(axis.chartProps.yDomain).toEqual([0, 2]);
        expect(axis.chartProps.yTicks).toEqual([0, 1, 2]);
        expect(axis.chartProps.yTickFormatter?.(1)).toBe('Medium');
    });

    it('formats categorical tooltip values', () => {
        expect(axis.tooltipFormatter(2, 'Category', tooltipItem(), 0, [])).toBe('High');
        expect(axis.tooltipFormatter(undefined, 'Category', tooltipItem(), 0, [])).toBe('');
    });

    it('formats categorical tooltip values only for the selected data key', () => {
        const formatter = axis.tooltipFormatterForDataKey('y');

        expect(formatter(1, 'Category', tooltipItem('y'), 0, [])).toBe('Medium');
        expect(formatter(7, 'Score', tooltipItem('yLine'), 0, [])).toBe('7');
    });
});
