import styled from 'styled-components';

import { markdownContentStyles } from 'src/components/BaseQuestionnaireResponseForm/readonly-widgets/MarkdownRender/sharedMarkdownStyles';

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
            position: sticky;
            top: 0;
            z-index: 10;
            margin: 0;
            width: 100%;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: flex-start;
            align-items: center;
            align-content: center;
            direction: ltr;
            overflow: visible;
            height: auto;
            gap: 4px 8px;
            padding: 4px 8px;
            border-radius: 8px 8px 0 0;
        }

        .mdxeditor-toolbar .MarkDownToolBar {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            width: 100%;
            justify-content: flex-start;
            align-items: center;
            align-content: center;
            direction: ltr;
            gap: 4px 8px;
        }

        .mdxeditor-toolbar [style*='margin-left: auto'] {
            margin-left: 0 !important;
        }

        img {
            max-width: 100%;
        }

        .mdxeditor,
        .MarkDownEditorContent {
            ${markdownContentStyles}
        }

        .mdxeditor table,
        .MarkDownEditorContent table {
            width: 100%;
            border-radius: 10px;
            border: 1px solid ${({ theme }) => theme.neutralPalette.gray_4};
            overflow: hidden;
            margin: 16px 0;
            padding: 16px;
            border-collapse: collapse;
        }

        blockquote {
            background: ${({ theme }) => theme.primaryPalette.bcp_1};
        }
    `,
};
