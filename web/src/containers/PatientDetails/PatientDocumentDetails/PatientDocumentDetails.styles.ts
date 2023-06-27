import styled from 'styled-components/macro';

export const S = {
    Content: styled.div`
        width: 710px;
        background-color: ${({ theme }) => theme.neutralPalette.gray_1};
        box-shadow: 0px 6px 16px ${({ theme }) => theme.neutralPalette.gray_4};
        padding: 24px 32px;
        border-radius: 10px;
    `,
};
