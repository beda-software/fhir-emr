import styled from 'styled-components';

export const S = {
    Container: styled.div`
        display: flex;
        flex-direction: column;
        gap: 24px;
    `,
    Suggestions: styled.div`
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
        margin-top: 12px;
        color: ${({ theme }) => theme.neutralPalette.gray_7};
    `,
};
