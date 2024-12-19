import { Layout } from 'antd';
import { isNumber, isString } from 'lodash';
import styled, { css } from 'styled-components';

const maxWidthStyles = css<{ $maxWidth?: number | string }>`
    ${({ $maxWidth }) => {
        if (isNumber($maxWidth)) {
            return css`
                max-width: ${() => `${$maxWidth}px`};
            `;
        }

        if (isString($maxWidth)) {
            return css`
                max-width: ${() => `${$maxWidth}`};
            `;
        }

        return css`
            max-width: 1080px;
        `;
    }}
`;

export const S = {
    Container: styled(Layout)`
        min-height: 100vh;
        position: relative;

        @media screen and (max-width: 767px) {
            padding-top: 50px;
        }
    `,
    Layout: styled(Layout)`
        background: 0;
        position: relative;
        padding-bottom: 64px;
    `,
    PageHeaderContainer: styled.div`
        background-color: ${({ theme }) => theme.neutralPalette.gray_1};
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0 24px;
    `,
    PageHeader: styled.div<{ $maxWidth?: number | string }>`
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 24px 0;
        gap: 32px 0;
        width: 100%;

        ${maxWidthStyles}
    `,
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
