import { HighlightProps, getHighlightYParams } from '../HighlightArea';

const createProps = (overrides: Partial<HighlightProps> = {}): HighlightProps => ({
    xAxisMap: { 0: { x: 0, width: 100 } },
    yAxisMap: { 0: { y: 0, height: 100 } },
    offset: { top: 0, bottom: 0, left: 0, right: 0, width: 100, height: 100 },
    chartHighlight: {},
    ...overrides,
});

describe('getHighlightYParams', () => {
    describe('returns null when required props are missing', () => {
        it('returns null when xAxisMap is undefined', () => {
            const props = createProps({ xAxisMap: undefined, chartHighlight: { from: 10, to: 20 } });
            expect(getHighlightYParams(props)).toBeNull();
        });

        it('returns null when yAxisMap is undefined', () => {
            const props = createProps({ yAxisMap: undefined, chartHighlight: { from: 10, to: 20 } });
            expect(getHighlightYParams(props)).toBeNull();
        });

        it('returns null when offset is undefined', () => {
            const props = createProps({ offset: undefined, chartHighlight: { from: 10, to: 20 } });
            expect(getHighlightYParams(props)).toBeNull();
        });

        it('returns null when yAxis.scale is not a function', () => {
            const props = createProps({
                yAxisMap: { 0: { y: 0, height: 100, scale: 'not-a-function' as never } },
                chartHighlight: { from: 10, to: 20 },
            });
            expect(getHighlightYParams(props)).toBeNull();
        });
    });

    describe('both from and to defined', () => {
        const mockScale = (value: number) => value;

        it('returns correct y and height when from < to', () => {
            const props = createProps({
                yAxisMap: { 0: { y: 0, height: 100, scale: mockScale } },
                chartHighlight: { from: 20, to: 40 },
            });
            const result = getHighlightYParams(props);
            expect(result).toEqual({ y: 20, height: 20 });
        });

        it('returns correct y and height when from > to', () => {
            const props = createProps({
                yAxisMap: { 0: { y: 0, height: 100, scale: mockScale } },
                chartHighlight: { from: 40, to: 20 },
            });
            const result = getHighlightYParams(props);
            expect(result).toEqual({ y: 20, height: 20 });
        });

        it('returns zero height when from equals to', () => {
            const props = createProps({
                yAxisMap: { 0: { y: 0, height: 100, scale: mockScale } },
                chartHighlight: { from: 30, to: 30 },
            });
            const result = getHighlightYParams(props);
            expect(result).toEqual({ y: 30, height: 0 });
        });

        it('clamps from to chart area when from is higher than axis range', () => {
            const props = createProps({
                offset: { top: 0, bottom: 0, left: 0, right: 0, width: 100, height: 100 },
                yAxisMap: { 0: { y: 0, height: 100, scale: mockScale, padding: { top: 0, bottom: 0 } } },
                chartHighlight: { from: 150, to: 200 },
            });
            const result = getHighlightYParams(props);
            expect(result!.y).toBe(100);
            expect(result!.height).toBe(0);
        });

        it('clamps from to chart area when from is lower than axis range', () => {
            const props = createProps({
                offset: { top: 0, bottom: 0, left: 0, right: 0, width: 100, height: 100 },
                yAxisMap: { 0: { y: 0, height: 100, scale: mockScale, padding: { top: 0, bottom: 0 } } },
                chartHighlight: { from: -50, to: 0 },
            });
            const result = getHighlightYParams(props);
            expect(result!.y).toBe(0);
            expect(result!.height).toBe(0);
        });

        it('clamps to to chart area when to is higher than axis range', () => {
            const props = createProps({
                offset: { top: 0, bottom: 0, left: 0, right: 0, width: 100, height: 100 },
                yAxisMap: { 0: { y: 0, height: 100, scale: mockScale, padding: { top: 0, bottom: 0 } } },
                chartHighlight: { from: 0, to: 150 },
            });
            const result = getHighlightYParams(props);
            expect(result!.y).toBe(0);
            expect(result!.height).toBe(100);
        });

        it('clamps to to chart area when to is lower than axis range', () => {
            const props = createProps({
                offset: { top: 0, bottom: 0, left: 0, right: 0, width: 100, height: 100 },
                yAxisMap: { 0: { y: 0, height: 100, scale: mockScale, padding: { top: 0, bottom: 0 } } },
                chartHighlight: { from: -100, to: -50 },
            });
            const result = getHighlightYParams(props);
            expect(result!.y).toBe(0);
            expect(result!.height).toBe(0);
        });
    });

    describe('only from defined', () => {
        const mockScale = (value: number) => value;

        it('returns height from from to bottom of chart area', () => {
            const props = createProps({
                yAxisMap: { 0: { y: 0, height: 100, scale: mockScale, padding: { top: 0, bottom: 0 } } },
                chartHighlight: { from: 30 },
            });
            const result = getHighlightYParams(props);
            expect(result).toEqual({ y: 0, height: 30 });
        });

        it('applies padding to bottom boundary', () => {
            const props = createProps({
                offset: { top: 0, bottom: 0, left: 0, right: 0, width: 100, height: 100 },
                yAxisMap: { 0: { y: 0, height: 100, scale: mockScale, padding: { top: 10, bottom: 10 } } },
                chartHighlight: { from: 80 },
            });
            const result = getHighlightYParams(props);
            expect(result!.y).toBe(10);
            expect(result!.height).toBe(70);
        });
    });

    describe('only to defined', () => {
        const mockScale = (value: number) => value;

        it('returns height from top to to', () => {
            const props = createProps({
                yAxisMap: { 0: { y: 0, height: 100, scale: mockScale, padding: { top: 0, bottom: 0 } } },
                chartHighlight: { to: 70 },
            });
            const result = getHighlightYParams(props);
            expect(result).toEqual({ y: 70, height: 30 });
        });

        it('applies padding to top boundary', () => {
            const props = createProps({
                offset: { top: 0, bottom: 0, left: 0, right: 0, width: 100, height: 100 },
                yAxisMap: { 0: { y: 0, height: 100, scale: mockScale, padding: { top: 10, bottom: 10 } } },
                chartHighlight: { to: 80 },
            });
            const result = getHighlightYParams(props);
            expect(result!.y).toBe(80);
            expect(result!.height).toBe(10);
        });
    });

    describe('with custom color', () => {
        const mockScale = (value: number) => value;

        it('returns result even when color is provided (color does not affect calculation)', () => {
            const props = createProps({
                yAxisMap: { 0: { y: 0, height: 100, scale: mockScale } },
                chartHighlight: { from: 20, to: 40, color: '#ff000033' },
            });
            const result = getHighlightYParams(props);
            expect(result).toEqual({ y: 20, height: 20 });
        });
    });
});
