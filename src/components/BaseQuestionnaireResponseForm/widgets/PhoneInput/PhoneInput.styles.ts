import styled, { css } from 'styled-components';

export const S = {
    Container: styled.div<{ $disabled: boolean}>`
        display: flex;
        width: fit-content;
        
        .react-tel-input {
            transition: all ${({ theme }) => theme.antdTheme?.motionDurationMid};
        }
        
        .react-tel-input._focused {
            border-radius: ${({ theme }) => theme.antdTheme?.borderRadius}px;
            box-shadow: 0 0 0 2px ${({ theme }) => theme.antdTheme?.controlOutline};
        }

        .react-phone-input {
            border-color: ${({ theme }) => theme.antdTheme?.colorBorder};
            height: 32px;
            box-shadow: none;
            border-radius: ${({ theme }) => theme.antdTheme?.borderRadius}px;
            background-color: ${({ theme }) => theme.antdTheme?.colorBgContainer};
            transition: all ${({ theme }) => theme.antdTheme?.motionDurationMid};
        }

        .react-phone-input__button {
            background-color: ${({ theme }) => theme.antdTheme?.colorBgContainer};
            border-color: ${({ theme }) => theme.antdTheme?.colorBorder};
            transition: all ${({ theme }) => theme.antdTheme?.motionDurationMid};
        }

        .flag-dropdown {
            border-radius: ${({ theme }) => theme.antdTheme?.borderRadius}px 0 0 ${({ theme }) => theme.antdTheme?.borderRadius}px !important;
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
        
        ${({ $disabled }) => $disabled && css`
            .react-phone-input {
                background-color: ${({ theme }) => theme.antdTheme?.colorBgContainerDisabled};
                color: ${({ theme }) => theme.antdTheme?.colorTextDisabled};
            }

            &:hover {
                .react-phone-input,
                .react-phone-input__button {
                    border-color: ${({ theme }) => theme.antdTheme?.colorBorder};
                }
            }
        `}
    `,
};
