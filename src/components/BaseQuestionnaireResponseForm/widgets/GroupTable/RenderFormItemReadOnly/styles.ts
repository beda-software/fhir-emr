import styled from 'styled-components';

export const S = {
    GridContainer: styled.div`
        display: flex;
        flex-direction: column;
        gap: 4px;
    `,
    GridRow: styled.div`
        display: grid;
        grid-template-columns: 1fr 1fr;
        column-gap: 8px;
        align-items: start;
    `,
    GridLabel: styled.div<{ $depth: number }>`
        padding-left: ${({ $depth }) => $depth * 12}px;
        white-space: nowrap;
    `,
    GridValue: styled.div<{ $fullWidth?: boolean }>`
        grid-column: ${({ $fullWidth }) => ($fullWidth ? '1 / -1' : 'auto')};
        min-width: 0;
    `,
};
