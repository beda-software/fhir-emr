import styled from 'styled-components';

import { Text } from 'src/components/Typography';

interface GridContainerProps {
    columns?: number;
}

export const S = {
    Header: styled.div`
        display: flex;
        gap: 16px;
        padding-right: calc(18px + 16px);
    `,

    Column: styled.div`
        width: 100%;
    `,

    Text: styled(Text)``,

    GridContainer: styled.div<GridContainerProps>`
        display: grid;
        grid-template-columns: ${({ columns }) => `repeat(${columns || 'auto-fit'}, minmax(100px, 1fr))`};
        gap: 10px;
        align-items: center;
    `,

    GridRowLabel: styled.div`
        display: flex;
        align-items: center;
        font-weight: bold;
        padding: 10px 0;
    `,

    GridItem: styled.div`
        display: flex;
        /* padding-right: calc(18px + 16px); */
    `,
};
