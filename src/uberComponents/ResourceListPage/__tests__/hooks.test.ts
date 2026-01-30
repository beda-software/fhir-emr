import { describe, expect, it } from 'vitest';

import { getSortSearchParam } from '../hooks';

describe('getSortSearchParam', () => {
    it('should combine default sort with unique order sort param', () => {
        const result = getSortSearchParam({ _sort: 'name' }, '-_lastUpdated');
        expect(result).toBe('name,-_lastUpdated');
    });

    it('should use default uniqueOrderSortSearchParam when not provided', () => {
        const result = getSortSearchParam({ _sort: 'name' });
        expect(result).toBe('name,-_lastUpdated');
    });

    it('should handle null uniqueOrderSortSearchParam', () => {
        const result = getSortSearchParam({ _sort: 'name' }, null);
        expect(result).toBe('name');
    });

    it('should handle empty default search params', () => {
        const result = getSortSearchParam({}, '-_lastUpdated');
        expect(result).toBe('-_lastUpdated');
    });

    it('should handle missing _sort in default search params', () => {
        const result = getSortSearchParam({ _count: 10 }, '-_lastUpdated');
        expect(result).toBe('-_lastUpdated');
    });

    it('should remove duplicate sort parameters', () => {
        const result = getSortSearchParam({ _sort: 'name,-_lastUpdated' }, '-_lastUpdated');
        expect(result).toBe('name,-_lastUpdated');
    });

    it('should handle multiple sort parameters in default search params', () => {
        const result = getSortSearchParam({ _sort: 'name,birthdate' }, '-_id');
        expect(result).toBe('name,birthdate,-_id');
    });

    it('should return only unique order param when _sort is undefined', () => {
        const result = getSortSearchParam({ _sort: undefined }, '-_id');
        expect(result).toBe('-_id');
    });

    it('should handle both null uniqueOrderSortSearchParam and missing _sort', () => {
        const result = getSortSearchParam({}, null);
        expect(result).toBe(undefined);
    });

    it('should handle same parameter with different order', () => {
        const result = getSortSearchParam({ _sort: '_lastUpdated' }, '-_lastUpdated');
        expect(result).toBe('_lastUpdated,-_lastUpdated');
    });
});
