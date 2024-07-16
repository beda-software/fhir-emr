import styled from 'styled-components';

import { Title } from 'src/components/Typography';

export const S = {
    Title: styled(Title)`
        margin: 0;
        position: relative;

        &:after {
            content: '';
            position: absolute;
            display: block;
            left: 0;
            right: 0;
            bottom: -20px;
            height: 1px;
            background-color: ${({ theme }) => theme.neutralPalette.gray_4};
        }
    `,
    Controls: styled.div`
        display: flex;
        align-items: center;
        gap: 12px;
    `,
    EncounterControls: styled.div`
        margin-left: auto;
    `,
};
