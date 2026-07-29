import { useTheme } from 'styled-components';

import type { ReferenceRange } from './referenceChart';

interface BandTickProps {
    x?: number | string;
    y?: number | string;
    payload?: { value?: unknown };
    bands: ReferenceRange[];
    bandColor: (band: ReferenceRange) => string;
    formatBand: (band: ReferenceRange) => string;
}

export function BandTick({ x, y, payload, bands, bandColor, formatBand }: BandTickProps) {
    const theme = useTheme();
    const band = typeof payload?.value === 'number' ? bands[payload.value] : undefined;
    if (x == null || y == null || !band) {
        return null;
    }
    return (
        <text x={Number(x)} y={Number(y)} textAnchor="end" dominantBaseline="central" fontSize={10} fontWeight={600}>
            <tspan fontSize={9} fill={bandColor(band)}>
                ●
            </tspan>
            <tspan dx={4} fill={theme.neutral.primaryText}>
                {formatBand(band)}
            </tspan>
        </text>
    );
}
