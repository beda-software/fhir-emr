import styled from 'styled-components/macro';

export const S = {
    Container: styled.div`
        display: flex;
        width: fit-content;

        .react-phone-input {
            border-color: ${({ theme }) => theme.neutralPalette.gray_5};
            height: 32px;
            box-shadow: none;
            border-radius: 6px;
            background-color: ${({ theme }) => theme.neutralPalette.gray_2};
        }

        .react-phone-input__button {
            background-color: ${({ theme }) => theme.neutralPalette.gray_2};
            border-color: ${({ theme }) => theme.neutralPalette.gray_5};
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
            background-color: ${({ theme }) => theme.neutralPalette.gray_2};
            border-radius: 8px;
            padding: 4px;
        }

        .country {
            padding: 5px 12px !important;
            font-size: 14px;
            border-radius: 4px;
            transition: background 0.3s ease;
            cursor: pointer;

            &:hover {
                background-color: ${({ theme }) => theme.neutral.background} !important;
            }

            &.country.active {
                font-weight: 600;
                background-color: ${({ theme }) => theme.primaryPalette.bcp_1} !important;
            }
        }
    `,
};
