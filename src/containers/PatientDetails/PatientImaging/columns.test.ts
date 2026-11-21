import { describe, expect, it } from 'vitest';

import { DEFAULT_IMAGING_COLUMNS, selectColumns } from './columns';

describe('selectColumns', () => {
    it('defaults to Date/time, Type, Series and Images', () => {
        expect(selectColumns(undefined, undefined)).toEqual(['started', 'modality', 'series', 'images']);
        expect(selectColumns(undefined, ['US', 'CT'])).toEqual(DEFAULT_IMAGING_COLUMNS);
    });

    it('drops Type when the page is for one modality', () => {
        expect(selectColumns(undefined, ['US'])).toEqual(['started', 'series', 'images']);
    });

    it("keeps the page's own columns as given", () => {
        const custom = { key: 'custom', title: 'Custom' };
        expect(selectColumns(['modality', custom], ['US'])).toEqual(['modality', custom]);
        expect(selectColumns([], undefined)).toEqual([]);
    });
});
