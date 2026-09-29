import { Radio } from 'antd';
import styled from 'styled-components';

export const S = {
    OptionGroup: styled(Radio.Group)`
        display: block;
        width: 100%;
    `,
    CategoryContainer: styled.div`
        display: flex;
        flex-direction: column;
        gap: 16px;
    `,
    CategorySelector: styled(Radio.Group)`
        flex-wrap: wrap;
        row-gap: 8px;

        .ant-radio-button-wrapper {
            flex: 1 1 150px;
            min-height: 40px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-color: ${({ theme }) => theme.antdTheme?.colorBorder};
        }

        .ant-radio-button-wrapper:first-child {
            border-start-start-radius: 8px;
            border-end-start-radius: 8px;
        }

        .ant-radio-button-wrapper:last-child {
            border-start-end-radius: 8px;
            border-end-end-radius: 8px;
        }
    `,
    OptionList: styled.div`
        display: flex;
        flex-direction: column;
        gap: 8px;
    `,
    OptionCard: styled(Radio)`
        display: flex;
        align-items: stretch;
        width: 100%;
        margin: 0;
        padding: 12px;
        border: 1px solid ${({ theme }) => theme.antdTheme?.colorBorderSecondary};
        border-radius: 8px;
        background-color: ${({ theme }) => theme.neutralPalette.gray_1};
        cursor: pointer;
        transition:
            background-color 0.15s,
            border-color 0.15s;

        & > .ant-radio {
            position: absolute;
            width: 0;
            height: 0;
            overflow: hidden;
            opacity: 0;
            pointer-events: none;
        }

        & > span:not(.ant-radio) {
            flex: 1;
            padding-inline-start: 0;
            padding-inline-end: 0;
        }

        &:hover {
            background-color: ${({ theme }) => theme.neutralPalette.gray_2};
        }

        &.ant-radio-wrapper-checked {
            border-color: ${({ theme }) => theme.antdTheme?.colorPrimary};
            background-color: ${({ theme }) => theme.primaryPalette.bcp_1};
        }
    `,
    OptionCardTitle: styled.div`
        font-weight: 600;
        font-size: 14px;
        line-height: 22px;
        color: ${({ theme }) => theme.neutral.primaryText};
    `,
    OptionCardDescription: styled.div`
        font-size: 12px;
        line-height: 20px;
        font-weight: 400;
        color: ${({ theme }) => theme.neutral.secondaryText};
    `,
    EmptyState: styled.div`
        padding: 24px 0;
        font-size: 14px;
        line-height: 22px;
        text-align: center;
        color: ${({ theme }) => theme.neutral.secondaryText};
    `,
    FooterButtons: styled.div`
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        gap: 8px;

        @media (max-width: 480px) {
            flex-direction: column;

            > button {
                width: 100%;
            }
        }
    `,
};
