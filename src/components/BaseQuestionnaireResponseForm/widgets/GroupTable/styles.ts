import styled, { css } from 'styled-components';

export const S = {
    TableWrapper: styled.div`
        .ant-table-thead > tr > th.ant-table-row-expand-icon-cell,
        .ant-table-tbody > tr > td.ant-table-row-expand-icon-cell {
            border-right: none !important;
        }

        .ant-table-cell {
            align-content: start;
        }
    `,
    ReadonlyItemWrapper: styled.div<{ $maxHeight?: number; $notFitsMaxHeight?: boolean }>`
        ${({ $maxHeight, $notFitsMaxHeight }) =>
            $maxHeight &&
            $notFitsMaxHeight &&
            css`
                max-height: ${$maxHeight}px;
                overflow: hidden;
                position: relative;
                -webkit-mask-image: linear-gradient(to bottom, black 60%, transparent 100%);
                mask-image: linear-gradient(to bottom, black 60%, transparent 100%);
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
    ActionButtons: styled.div`
        display: flex;
        gap: 16px;
        .ant-btn {
            padding: 0;
        }
    `,
};
