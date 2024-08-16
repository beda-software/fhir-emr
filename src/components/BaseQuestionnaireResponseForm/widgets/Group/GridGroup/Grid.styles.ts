import styled from 'styled-components';

import { Text } from 'src/components/Typography';

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

    GridContainer: styled.div`
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
        align-items: center;
    `,

    GridItem: styled.div`
        display: flex;
        gap: 16px;
        padding-right: calc(18px + 16px);
    `,

    GridRowLabel: styled.div`
        display: flex;
        align-items: center;
        font-weight: bold;
        padding: 10px 0;
    `,
};
