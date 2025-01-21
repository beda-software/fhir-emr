import styled from 'styled-components';

import { maxWidthStyles } from '../PageContainerHeader/styles';

export const S = {
    PageContentContainer: styled.div`
        padding: 0 24px;
        display: flex;
        flex-direction: column;
        align-items: center;
    `,
    PageContent: styled.div<{ $maxWidth?: number | string }>`
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 32px 0;
        gap: 24px 0;
        width: 100%;

        ${maxWidthStyles}
    `,
};
