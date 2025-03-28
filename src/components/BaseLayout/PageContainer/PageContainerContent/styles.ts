import styled, { css } from 'styled-components';

import { maxWidthStyles } from '../PageContainerHeader/styles';

export const S = {
    PageContentContainer: styled.div<{ $level: 1 | 2 }>`
        padding: 0 24px;
        display: flex;
        flex-direction: column;
        align-items: center;

        ${({ $level }) =>
            $level === 2 &&
            css`
                padding: 0;
            `}
    `,
    PageContent: styled.div<{ $level: 1 | 2; $maxWidth?: number | string }>`
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 32px 0;
        gap: 24px 0;
        width: 100%;

        ${({ $level }) =>
            $level === 2 &&
            css`
                padding: 0;
            `}

        ${maxWidthStyles}
    `,
};
