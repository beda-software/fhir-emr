import styled from 'styled-components';

import { Text } from 'src/components/Typography';

export const S = {
    Footer: styled.footer`
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 64px;
        display: flex;
        align-items: center;
        justify-content: center;

        --footer-text: ${({ theme }) => theme.neutralPalette.gray_7};
        --footer-link-active: ${({ theme }) => theme.primaryPalette.bcp_6};

        &._light {
            --footer-text: rgba(255, 255, 255, 0.75);
            --footer-link-active: #fff;
        }
    `,
    Content: styled.div`
        color: var(--footer-text);
        font-size: 14px;
        line-height: 22px;
    `,
    Link: styled.a`
        color: var(--footer-text);
        transition: color 0.2s;
        text-decoration: underline;

        &:hover {
            color: var(--footer-link-active);
            text-decoration: underline;
        }
    `,
    Text: styled(Text)`
        color: var(--footer-text);
        font-size: 14px;
        line-height: 22px;
    `,
};
