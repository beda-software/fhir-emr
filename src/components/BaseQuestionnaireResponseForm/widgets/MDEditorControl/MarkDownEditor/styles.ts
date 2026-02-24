import styled from 'styled-components';

export const S = {
    MDXEditorWrapper: styled.div`
        transition: all 0.2s;

        .mdxeditor {
            border: 1px solid ${({ theme }) => theme.neutralPalette.gray_5};
            border-radius: 8px;
        }

        .mdxeditor:hover {
            border-color: ${({ theme }) => theme.primary}cc;
        }

        .mdxeditor:focus-within {
            border-color: ${({ theme }) => theme.primary};
            box-shadow: 0 0 0 2px ${({ theme }) => theme.primary}0d;
        }

        .mdxeditor-toolbar {
            z-index: 0;
            position: unset;
            z-index: 1;
            margin: 0;
            width: 100%;
            overflow-x: scroll;
            scrollbar-width: thin;
        }

        img {
            max-width: 100%;
        }

        blockquote {
            background: ${({ theme }) => theme.primaryPalette.bcp_1};
        }
    `,
};
