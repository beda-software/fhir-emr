import { Layout } from 'antd';
import styled from 'styled-components/macro';

export const S = {
    Container: styled(Layout)`
        position: relative;
        padding: 16px;
        border-radius: 10px;
        background-color: ${({ theme }) => theme.primaryPalette.bcp_3};
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: 16px 32px;
        flex-wrap: wrap;

        .ant-input-search,
        .ant-picker {
            width: 264px;
        }
    `,
};
