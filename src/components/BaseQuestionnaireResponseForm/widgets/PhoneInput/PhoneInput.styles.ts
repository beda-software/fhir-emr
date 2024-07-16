import styled from 'styled-components';

export const S = {
    Container: styled.div`
        display: flex;
        width: fit-content;

        .react-phone-input {
            border-color: ${({ theme }) => theme.antdTheme?.colorBorder};
            height: 32px;
            box-shadow: none;
            border-radius: 6px;
            background-color: ${({ theme }) => theme.antdTheme?.colorBgContainer};
        }

        .react-phone-input__button {
            background-color: ${({ theme }) => theme.antdTheme?.colorBgContainer};
            border-color: ${({ theme }) => theme.antdTheme?.colorBorder};
        }

        .flag-dropdown {
            border-radius: 6px 0 0 6px !important;
            background: 0 !important;
        }

        .selected-flag {
            background: 0 !important;
        }

        &:hover {
            .react-phone-input,
            .react-phone-input__button {
                border-color: ${({ theme }) => theme.primary};
            }
        }

        .country-list {
            background-color: ${({ theme }) => theme.antdTheme?.colorBgContainer};
            border-radius: 8px;
            padding: 4px;
        }

        .country {
            padding: 5px 12px !important;
            font-size: 14px;
            border-radius: 4px;
            transition: background 0.3s ease;
            cursor: pointer;
            color: ${({ theme }) => theme.antdTheme?.colorText};

            &:hover {
                background-color: ${({ theme }) => theme.antdTheme?.controlItemBgHover} !important;
            }

            &.country.active {
                font-weight: 600;
                background-color: ${({ theme }) => theme.primaryPalette.bcp_1} !important;
            }
        }
    `,
};
