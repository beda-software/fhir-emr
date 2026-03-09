import styled from 'styled-components';

export const S = {
    MDXEditorWrapper: styled.div`
        transition: all 0.2s;
        position: relative;

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
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: flex-start;
            align-content: flex-start;
            direction: ltr;
            overflow: visible;
            height: auto;
            row-gap: 4px;
        }

        .mdxeditor-toolbar .MarkDownToolBar {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            width: 100%;
            justify-content: flex-start;
            align-content: flex-start;
            direction: ltr;
            row-gap: 4px;
        }

        .mdxeditor-toolbar [style*='margin-left: auto'] {
            margin-left: 0 !important;
            flex-basis: 100%;
        }

        img {
            max-width: 100%;
        }

        blockquote {
            background: ${({ theme }) => theme.primaryPalette.bcp_1};
        }
    `,
};
