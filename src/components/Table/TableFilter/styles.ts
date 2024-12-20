import styled, { css } from 'styled-components';

const shadows = css`
    ${({ theme }) =>
        theme.mode === 'light' &&
        css`
            box-shadow:
                0px 6px 16px 0px ${({ theme }) => theme.neutral.dividers},
                0px 3px 6px -4px ${({ theme }) => theme.neutral.border},
                0px 9px 28px 8px ${({ theme }) => theme.neutral.background};
        `}

    ${({ theme }) =>
        theme.mode === 'dark' &&
        css`
            box-shadow:
                0 6px 16px 0 rgba(0, 0, 0, 0.08),
                0 3px 6px -4px rgba(0, 0, 0, 0.12),
                0 9px 28px 8px rgba(0, 0, 0, 0.05);
        `}
`;

export const S = {
    Container: styled.div`
        .ant-input-search,
        .ant-picker,
        .react-select__control {
            width: 100%;
        }

        .react-select__menu {
            position: static;
        }

        .react-select__menu {
            box-shadow: none;
            padding: 8px 4px 4px;
            margin: 8px -8px -8px;
            border-top: 1px solid ${({ theme }) => theme.neutral.dividers};
            border-radius: 0;
            width: auto;
        }

        .react-select__menu-list {
            padding: 0;
        }
    `,
    DatePickerFilter: styled.div`
        width: 288px;

        .ant-picker {
            ${shadows}
        }
    `,
    Filter: styled.div`
        display: flex;
        flex-direction: column;
        padding: 8px;
        border-radius: 8px;
        min-width: 240px;
        background-color: ${({ theme }) => theme.neutralPalette.gray_1};
        border-radius: 6px;
        overflow: hidden;

        ${shadows}
    `,
};
