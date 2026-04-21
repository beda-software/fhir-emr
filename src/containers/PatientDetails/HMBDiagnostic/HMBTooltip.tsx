/* eslint-disable react-refresh/only-export-components */
import type { ValueType } from 'recharts/types/component/DefaultTooltipContent';
import type { TooltipContentProps } from 'recharts/types/component/Tooltip';
import styled from 'styled-components';

import { getFlowLabel } from './transforms/toFlowVolume';
import { getSeverityLabel } from './transforms/toPainScore';
import { HMBChartDatum } from './types';

const S = {
    TooltipCard: styled.div`
        min-width: 180px;
        padding: 12px;
        border: 1px solid ${({ theme }) => theme.neutralPalette.gray_5};
        border-radius: 10px;
        background: ${({ theme }) => theme.neutralPalette.gray_1};
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    `,
    TooltipTitle: styled.div`
        margin-bottom: 8px;
        font-size: 12px;
        color: ${({ theme }) => theme.neutralPalette.gray_8};
    `,
    TooltipRow: styled.div`
        display: flex;
        align-items: center;
        gap: 8px;

        & + & {
            margin-top: 6px;
        }

        strong {
            margin-left: auto;
        }
    `,
    TooltipMarker: styled.span`
        width: 10px;
        height: 10px;
        border-radius: 999px;
        flex: 0 0 auto;
    `,
};

type ValueFormatter = (value: number, dataKey: string) => string;

export function makeHMBTooltip(valueFormatter?: ValueFormatter) {
    return function TooltipContent({ active, label, payload }: TooltipContentProps<ValueType, string | number>) {
        if (!active || !payload?.length) {
            return null;
        }

        const tooltipLabel = (payload[0] as { payload?: HMBChartDatum } | undefined)?.payload?.xLabel;

        return (
            <S.TooltipCard>
                <S.TooltipTitle>{tooltipLabel ?? label}</S.TooltipTitle>
                {payload.map((entry) => {
                    const dataKey = String(entry.dataKey ?? '');
                    const formatted =
                        typeof entry.value === 'number' && valueFormatter
                            ? valueFormatter(entry.value, dataKey)
                            : entry.value;
                    return (
                        <S.TooltipRow key={`${dataKey || entry.name}-${entry.value}`}>
                            <S.TooltipMarker style={{ backgroundColor: entry.color ?? 'currentColor' }} />
                            <span>{entry.name}</span>
                            <strong>{formatted}</strong>
                        </S.TooltipRow>
                    );
                })}
            </S.TooltipCard>
        );
    };
}

export const flowTooltip = makeHMBTooltip((value) => getFlowLabel(value));

export const painTooltip = makeHMBTooltip((value, dataKey) =>
    dataKey === 'y' ? getSeverityLabel(value) : String(value),
);

export const numericTooltip = makeHMBTooltip((value) => value.toFixed(1));
