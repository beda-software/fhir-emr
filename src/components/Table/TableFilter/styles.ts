import styled from 'styled-components';

export const S = {
    Filter: styled.div`
        display: flex;
        flex-direction: column;
        padding: 8px;
        border-radius: 8px;
        box-shadow:
            0px 6px 16px 0px ${({ theme }) => theme.neutral.dividers},
            0px 3px 6px -4px ${({ theme }) => theme.neutral.border},
            0px 9px 28px 8px ${({ theme }) => theme.neutral.background};
        min-width: 240px;

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
};
