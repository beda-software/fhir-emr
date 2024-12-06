import styled from 'styled-components';

export const S = {
    Table: styled.div`
        overflow: auto;

        .ant-spin-container {
            min-width: fit-content;
        }

        .ant-table {
            min-width: fit-content;
        }

        .ant-table-container {
            min-width: fit-content;
        }

        .ant-table-content {
            min-width: fit-content;
        }

        .ant-table-thead .ant-table-cell {
            background-color: ${({ theme }) => theme.neutralPalette.gray_3};
        }
    `,
};
