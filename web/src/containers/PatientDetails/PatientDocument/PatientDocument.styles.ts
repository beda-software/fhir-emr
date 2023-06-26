import styled from 'styled-components/macro';

export const S = {
    Content: styled.div`
        width: 540px;
        background-color: ${({ theme }) => theme.neutralPalette.gray_1};
        box-shadow: 0px 6px 16px ${({ theme }) => theme.neutralPalette.gray_4};
        padding: 32px;
        border-radius: 10px;
    `,
};
