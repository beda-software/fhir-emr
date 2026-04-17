import styled from 'styled-components';

export const S = {
    Grid: styled.div`
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
        padding: 16px;

        @media (max-width: 1024px) {
            grid-template-columns: 1fr;
        }
    `,
};
