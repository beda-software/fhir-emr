import type { ValueType } from 'recharts/types/component/DefaultTooltipContent';
import type { TooltipContentProps } from 'recharts/types/component/Tooltip';
import styled from 'styled-components';

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

export function ChartTooltip({
    active,
    label,
    payload,
    labelFormatter,
    formatter,
}: TooltipContentProps<ValueType, string | number>) {
    if (!active || !payload?.length) {
        return null;
    }

    const titleNode = labelFormatter ? labelFormatter(label, payload) : label;

    return (
        <S.TooltipCard>
            <S.TooltipTitle>{titleNode}</S.TooltipTitle>
            {payload.map((entry, index) => {
                const dataKey = String(entry.dataKey ?? '');
                const formatted = formatter
                    ? formatter(entry.value, entry.name ?? '', entry, index, payload)
                    : entry.value;
                const display = Array.isArray(formatted) ? formatted[0] : formatted;
                return (
                    <S.TooltipRow key={`${dataKey || entry.name}-${entry.value}`}>
                        <S.TooltipMarker style={{ backgroundColor: entry.color ?? 'currentColor' }} />
                        <span>{entry.name}</span>
                        <strong>{display}</strong>
                    </S.TooltipRow>
                );
            })}
        </S.TooltipCard>
    );
}
