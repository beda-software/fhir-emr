import styled from 'styled-components';

export const S = {
    Option: styled.div`
        display: flex;
        border-top: 1px solid ${({ theme }) => theme.neutralPalette.gray_4};
        padding-top: 20px;

        .buttons {
            display: flex;
            gap: 16px;
        }
    `,
    Buttons: styled.div`
        display: flex;
        gap: 16px;
    `,
};
