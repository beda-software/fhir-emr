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
};
