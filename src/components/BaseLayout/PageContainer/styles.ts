import styled, { css } from 'styled-components';

import { Title } from 'src/components/Typography';
import { mobileWidth } from 'src/theme/utils';

import { PageContainerContent } from './PageContainerContent';
import { PageContainerHeader } from './PageContainerHeader';

export const S = {
    HeaderContainer: styled(PageContainerHeader)<{ $variant?: 'default' | 'with-table' | 'with-tabs' }>`
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
        flex-wrap: wrap;
        gap: 16px 40px;
        position: relative;

        @media screen and (max-width: ${() => `${mobileWidth - 1}px`}) {
            padding-right: 48px;
        }
    `,
    Title: styled(Title)`
        margin-bottom: 0 !important;
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
    ContentContainer: styled(PageContainerContent)<{ $variant?: 'default' | 'with-table' | 'with-tabs' }>`
        ${({ $variant }) =>
            $variant === 'with-table' &&
            css`
                padding-top: 0;
                margin-top: -47px;
            `}
    `,
};
