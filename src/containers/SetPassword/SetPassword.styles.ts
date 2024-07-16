import styled from 'styled-components';

export const S = {
    Container: styled.div`
        min-height: 100vh;
        background-color: ${({ theme }) => theme.primaryPalette.bcp_1};
        display: flex;
        justify-content: center;
        padding: 10px;
        align-items: flex-start;
    `,
    Form: styled.div`
        width: 400px;
        background-color: ${({ theme }) => theme.neutralPalette.gray_1};
        padding: 40px 30px 20px;
        border-radius: 4px;
        box-shadow: 0px 2px 6px -1px rgba(0, 19, 74, 0.12);
    `,
};
