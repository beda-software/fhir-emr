import styled, { css } from 'styled-components';

export const S = {
    TableWrapper: styled.div`
        .ant-table-thead > tr > th.ant-table-row-expand-icon-cell,
        .ant-table-tbody > tr > td.ant-table-row-expand-icon-cell {
            border-right: none !important;
        }
    `,
    ReadonlyItemWrapper: styled.div<{ $maxHeight?: number }>`
        ${({ $maxHeight }) =>
            $maxHeight &&
            css`
                max-height: ${$maxHeight}px;
                overflow: hidden;
            `}
    `,
    ChartItem: styled.div<{ $chartHeight?: number }>`
        width: 100%;
        height: 273px;
        display: flex;
        justify-content: center;
        align-items: center;

        ${({ $chartHeight }) =>
            $chartHeight &&
            css`
                height: ${$chartHeight}px;
            `}
    `,
};
