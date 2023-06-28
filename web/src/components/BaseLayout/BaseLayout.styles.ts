import { Layout } from 'antd';
import styled from 'styled-components/macro';

export const S = {
    Container: styled(Layout)`
        min-height: 100vh;
        position: relative;

        @media screen and (max-width: 767px) {
            padding-top: 50px;
        }
    `,
    PageWrapper: styled.div`
        background-color: ${({ theme }) => theme.primaryPalette.bcp_2};
        display: flex;
        justify-content: center;
    `,
};
