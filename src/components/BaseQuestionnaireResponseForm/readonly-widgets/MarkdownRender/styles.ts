import styled from 'styled-components';

import { markdownContentStyles } from './sharedMarkdownStyles';

export const S = {
    WrapperMDRender: styled.div`
        width: 100%;
        padding: 0;
        gap: 4px 16px;
        margin: 0;
        font-size: 14px;
        line-height: 22px;
        margin-bottom: 0;
        word-break: break-word;

        ${markdownContentStyles}
    `,
    CardWrapper: styled.div`
        max-width: 720px;
        justify-self: center;
        margin-left: auto;
        margin-right: auto;
    `,
};
