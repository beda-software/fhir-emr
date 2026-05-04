import { HighlightParams, getHighlightYParams } from '../HighlightArea';

const createParams = (overrides: Partial<HighlightParams> = {}): HighlightParams => ({
    plotArea: { x: 0, y: 0, width: 100, height: 100 },
    yAxisPadding: { top: 0, bottom: 0 },
    yScale: (value: unknown) => value as number,
    chartHighlight: {},
    ...overrides,
});

describe('getHighlightYParams', () => {
    describe('returns null when required props are missing', () => {
        it('returns null when xAxisMap is undefined', () => {
            const params = createParams({ plotArea: undefined, chartHighlight: { from: 10, to: 20 } });
            expect(getHighlightYParams(params)).toBeNull();
        });

        it('returns null when plotArea is undefined', () => {
            const params = createParams({ plotArea: undefined, chartHighlight: { from: 10, to: 20 } });
            expect(getHighlightYParams(params)).toBeNull();
        });

        it('returns null when yScale is undefined', () => {
            const params = createParams({ yScale: undefined, chartHighlight: { from: 10, to: 20 } });
            expect(getHighlightYParams(params)).toBeNull();
        });

        it('returns null when yScale is not a function', () => {
            const params = createParams({
                yScale: 'not-a-function' as never,
                chartHighlight: { from: 10, to: 20 },
            });
            expect(getHighlightYParams(params)).toBeNull();
        });
    });

    describe('both from and to defined', () => {
        const mockScale = (value: unknown) => value as number;

        it('returns correct y and height when from < to', () => {
            const params = createParams({
                yScale: mockScale,
                chartHighlight: { from: 20, to: 40 },
            });
            const result = getHighlightYParams(params);
            expect(result).toEqual({ y: 20, height: 20 });
        });

        it('returns correct y and height when from > to', () => {
            const params = createParams({
                yScale: mockScale,
                chartHighlight: { from: 40, to: 20 },
            });
            const result = getHighlightYParams(params);
            expect(result).toEqual({ y: 20, height: 20 });
        });

        it('returns zero height when from equals to', () => {
            const params = createParams({
                yScale: mockScale,
                chartHighlight: { from: 30, to: 30 },
            });
            const result = getHighlightYParams(params);
            expect(result).toEqual({ y: 30, height: 0 });
        });

        it('clamps from to chart area when from is higher than axis range', () => {
            const params = createParams({
                plotArea: { x: 0, y: 0, width: 100, height: 100 },
                yAxisPadding: { top: 0, bottom: 0 },
                yScale: mockScale,
                chartHighlight: { from: 150, to: 200 },
            });
            const result = getHighlightYParams(params);
            expect(result!.y).toBe(100);
            expect(result!.height).toBe(0);
        });

        it('clamps from to chart area when from is lower than axis range', () => {
            const params = createParams({
                plotArea: { x: 0, y: 0, width: 100, height: 100 },
                yAxisPadding: { top: 0, bottom: 0 },
                yScale: mockScale,
                chartHighlight: { from: -50, to: 0 },
            });
            const result = getHighlightYParams(params);
            expect(result!.y).toBe(0);
            expect(result!.height).toBe(0);
        });

        it('clamps to to chart area when to is higher than axis range', () => {
            const params = createParams({
                plotArea: { x: 0, y: 0, width: 100, height: 100 },
                yAxisPadding: { top: 0, bottom: 0 },
                yScale: mockScale,
                chartHighlight: { from: 0, to: 150 },
            });
            const result = getHighlightYParams(params);
            expect(result!.y).toBe(0);
            expect(result!.height).toBe(100);
        });

        it('clamps to to chart area when to is lower than axis range', () => {
            const params = createParams({
                plotArea: { x: 0, y: 0, width: 100, height: 100 },
                yAxisPadding: { top: 0, bottom: 0 },
                yScale: mockScale,
                chartHighlight: { from: -100, to: -50 },
            });
            const result = getHighlightYParams(params);
            expect(result!.y).toBe(0);
            expect(result!.height).toBe(0);
        });
    });

    describe('only from defined', () => {
        const mockScale = (value: unknown) => value as number;

        it('returns height from from to bottom of chart area', () => {
            const params = createParams({
                yAxisPadding: { top: 0, bottom: 0 },
                yScale: mockScale,
                chartHighlight: { from: 30 },
            });
            const result = getHighlightYParams(params);
            expect(result).toEqual({ y: 0, height: 30 });
        });

        it('applies padding to bottom boundary', () => {
            const params = createParams({
                plotArea: { x: 0, y: 0, width: 100, height: 100 },
                yAxisPadding: { top: 10, bottom: 10 },
                yScale: mockScale,
                chartHighlight: { from: 80 },
            });
            const result = getHighlightYParams(params);
            expect(result!.y).toBe(10);
            expect(result!.height).toBe(70);
        });
    });

    describe('only to defined', () => {
        const mockScale = (value: unknown) => value as number;

        it('returns height from top to to', () => {
            const params = createParams({
                yAxisPadding: { top: 0, bottom: 0 },
                yScale: mockScale,
                chartHighlight: { to: 70 },
            });
            const result = getHighlightYParams(params);
            expect(result).toEqual({ y: 70, height: 30 });
        });

        it('applies padding to top boundary', () => {
            const params = createParams({
                plotArea: { x: 0, y: 0, width: 100, height: 100 },
                yAxisPadding: { top: 10, bottom: 10 },
                yScale: mockScale,
                chartHighlight: { to: 80 },
            });
            const result = getHighlightYParams(params);
            expect(result!.y).toBe(80);
            expect(result!.height).toBe(10);
        });
    });

    describe('with custom color', () => {
        const mockScale = (value: unknown) => value as number;

        it('returns result even when color is provided (color does not affect calculation)', () => {
            const params = createParams({
                yScale: mockScale,
                chartHighlight: { from: 20, to: 40, color: '#ff000033' },
            });
            const result = getHighlightYParams(params);
            expect(result).toEqual({ y: 20, height: 20 });
        });
    });
});
