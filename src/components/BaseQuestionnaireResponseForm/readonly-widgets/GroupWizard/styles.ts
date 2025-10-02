import styled from 'styled-components';

export const S = {
    Group: styled.div<{ $active: boolean }>`
        display: flex;
        flex-direction: column;
        gap: inherit;
        flex: 1;
    `,
};
