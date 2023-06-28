import styled from 'styled-components/macro';

export const S = {
    Container: styled.div`
        .react-select__control {
            border-color: ${({ theme }) => theme.neutralPalette.gray_5};
            min-height: 32px;
            height: 32px;
            box-shadow: none;
            border-radius: 6px;
            background-color: ${({ theme }) =>
                theme.mode === 'dark' ? theme.neutralPalette.gray_2 : theme.neutralPalette.gray_1};

            &:hover {
                border-color: ${({ theme }) => theme.primary};
            }
        }

        .react-select__control--menu-is-open,
        .react-select__control--is-focused {
            border-color: ${({ theme }) => theme.primary};
            box-shadow: 0 0 0 2px rgb(5 145 255 / 10%);
        }

        .react-select__value-container {
            height: 30px;
            padding: 3px 11px;
            line-height: 24px;
        }

        .react-select__indicator {
            height: 30px;
            padding: 5px 6px;
            cursor: pointer;
            color: ${({ theme }) => theme.neutralPalette.gray_5};
        }

        .react-select__placeholder {
            margin: 0;
            color: ${({ theme }) => theme.neutralPalette.gray_5};
        }

        .react-select__input-container {
            margin: 0;
            padding: 0;
        }

        .react-select__indicator-separator {
            margin: 0;
            background-color: ${({ theme }) => theme.neutralPalette.gray_5};
        }

        .react-select__menu {
            background-color: ${({ theme }) =>
                theme.mode === 'dark' ? theme.neutralPalette.gray_2 : theme.neutralPalette.gray_1};
            border-radius: 8px;
            padding: 4px;
        }

        .react-select__option {
            padding: 5px 12px;
            font-size: 14px;
            border-radius: 4px;
            transition: background 0.3s ease;
            cursor: pointer;
        }

        .react-select__option--is-selected {
            font-weight: 600;
            background-color: ${({ theme }) => theme.primaryPalette.bcp_1};
        }

        .react-select__option--is-focused {
            background-color: ${({ theme }) => theme.neutral.background};
        }

        .react-select__single-value {
            color: ${({ theme }) => theme.neutralPalette.gray_13};
        }

        .react-select__value-container--is-multi {
            padding: 1px 4px;
        }

        .react-select__multi-value {
            background-color: ${({ theme }) => theme.neutralPalette.gray_3};
            border-radius: 6px;
            padding: 0 4px 0 8px;
        }

        .react-select__multi-value__label {
            font-size: 14px;
            color: ${({ theme }) => theme.neutralPalette.gray_13};
            padding: 0;
            margin-right: 2px;
        }

        .react-select__multi-value__remove {
            color: ${({ theme }) => theme.neutralPalette.gray_5};
        }

        .react-select__multi-value__remove:hover {
            background: 0;
            cursor: pointer;
            color: ${({ theme }) => theme.neutralPalette.gray_13};
        }
    `,
};
