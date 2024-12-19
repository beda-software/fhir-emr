import styled from 'styled-components';

export const S = {
    Container: styled.div`
        .react-select__control {
            border-color: ${({ theme }) => theme.antdTheme?.colorBorder};
            min-height: 32px;
            box-shadow: none;
            border-radius: 6px;
            background-color: ${({ theme }) => theme.antdTheme?.colorBgContainer};

            &:hover {
                border-color: ${({ theme }) => theme.antdTheme?.colorPrimary};
            }
        }

        .react-select__menu {
            z-index: 10;
        }

        .react-select__control--menu-is-open,
        .react-select__control--is-focused {
            border-color: ${({ theme }) => theme.antdTheme?.colorPrimary};
            box-shadow: 0 0 0 2px rgb(5 145 255 / 10%);
        }

        .react-select__value-container {
            padding: 3px 11px;
            line-height: 24px;
        }

        .react-select__indicator {
            height: 30px;
            padding: 5px 6px;
            cursor: pointer;
            color: ${({ theme }) => theme.antdTheme?.colorTextPlaceholder};
        }

        .react-select__loading-indicator {
            justify-content: center;
            align-items: center;
        }

        .react-select__placeholder {
            margin: 0;
            color: ${({ theme }) => theme.antdTheme?.colorTextDisabled};
        }

        .react-select__input-container {
            margin: 0;
            padding: 0;

            input {
                color: ${({ theme }) => theme.antdTheme?.colorText} !important;
            }
        }

        .react-select__indicator-separator {
            margin: 0;
            background-color: ${({ theme }) => theme.antdTheme?.colorBorder};
        }

        .react-select__menu {
            background-color: ${({ theme }) => theme.antdTheme?.colorBgContainer};
            border-radius: 8px;
            padding: 4px;
            color: ${({ theme }) => theme.antdTheme?.colorTextBase};
        }

        .react-select__option {
            padding: 5px 12px;
            font-size: 14px;
            border-radius: 4px;
            transition: background 0.3s ease;
            cursor: pointer;
        }

        .react-select__option--is-focused,
        .react-select__option--is-focused:active {
            background-color: ${({ theme }) => theme.antdTheme?.controlItemBgHover};
        }

        .react-select__option--is-selected,
        .react-select__option--is-selected:active {
            font-weight: 600;
            background-color: ${({ theme }) => theme.primaryPalette.bcp_1};
            color: ${({ theme }) => theme.antdTheme?.colorText};
        }

        .react-select__single-value {
            color: ${({ theme }) => theme.antdTheme?.colorText};
        }

        .react-select__value-container--is-multi.react-select__value-container--has-value {
            padding: 1px 4px;
        }

        .react-select__multi-value {
            background-color: ${({ theme }) => theme.antdTheme?.colorFillContent};
            border-radius: 6px;
            padding: 0 4px 0 8px;
        }

        .react-select__multi-value__label {
            font-size: 14px;
            color: ${({ theme }) => theme.antdTheme?.colorText};
            padding: 0;
            margin-right: 2px;
        }

        .react-select__multi-value__remove {
            color: ${({ theme }) => theme.antdTheme?.colorIcon};
        }

        .react-select__multi-value__remove:hover {
            background: 0;
            cursor: pointer;
            color: ${({ theme }) => theme.antdTheme?.colorText};
        }
    `,
};
