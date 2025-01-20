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
        }

        .mdxeditor-popup-container {
            z-index: 1000;
        }
    `,
};
