import styled, { css } from 'styled-components';

import { BasePageContent, BasePageHeader } from '..';

export const S = {
    HeaderContainer: styled(BasePageHeader)<{ $variant?: 'default' | 'with-table' | 'with-tabs' }>`
        display: flex;
        flex-direction: column;

        ${({ $variant }) =>
            $variant === 'with-table' &&
            css`
                padding-bottom: 79px;
            `}

        ${({ $variant }) =>
            $variant === 'with-tabs' &&
            css`
                padding-bottom: 0;
            `}
    `,
    Header: styled.div`
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0 40px;
    `,
    HeaderLeftColumn: styled.div`
        display: flex;
        align-items: center;
        gap: 0 8px;
    `,
    HeaderRightColumn: styled.div`
        display: flex;
        align-items: center;
        gap: 0 40px;
    `,
    ContentContainer: styled(BasePageContent)<{ $variant?: 'default' | 'with-table' | 'with-tabs' }>`
        ${({ $variant }) =>
            $variant === 'with-table' &&
            css`
                padding-top: 0;
                margin-top: -47px;
            `}
    `,
};
