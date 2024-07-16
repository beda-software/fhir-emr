import { Input } from 'antd';
import styled, { css } from 'styled-components';

import { Text } from 'src/components/Typography';

const { TextArea } = Input;

export const S = {
    Container: styled.div`
        background-color: ${({ theme }) => theme.neutralPalette.gray_1};
        border-radius: 10px;
        padding: 16px;
        border: 1px solid ${({ theme }) => theme.neutralPalette.gray_4};
    `,
    Scriber: styled.div`
        display: flex;
        flex-direction: column;
        gap: 8px 0;

        .audio-recorder {
            width: 100%;
            box-shadow: none;
            border-radius: 30px;
            background-color: ${({ theme }) => theme.neutralPalette.gray_2};
            padding: 3px 6px 3px 18px;
        }

        .audio-recorder-timer,
        .audio-recorder-status {
            font-family: inherit;
            color: ${({ theme }) => theme.neutralPalette.gray_12};
        }

        .audio-recorder-mic {
            display: none;
        }

        .audio-recorder-timer {
            margin-left: 0;
        }

        .audio-recorder-options {
            filter: ${({ theme }) => (theme.mode === 'dark' ? `invert(100%)` : `invert(0%)`)};
        }
    `,
    Title: styled(Text)<{ $danger?: boolean }>`
        font-weight: 700;

        ${({ $danger }) =>
            $danger &&
            css`
                color: ${({ theme }) => theme.antdTheme?.red5};
            `}
    `,
    Textarea: styled(TextArea)`
        border: 1px solid ${({ theme }) => theme.neutralPalette.gray_4};
        background-color: ${({ theme }) => theme.neutralPalette.gray_2};
        padding: 5px 12px;
        border-radius: 8px;
        height: 142px;
        width: 100%;
        font-family: inherit;
    `,
    Controls: styled.div`
        display: flex;
        align-items: center;
        gap: 0 12px;
    `,
    TextResults: styled.div`
        padding-bottom: 8px;
        white-space: pre-line;
    `,
    ModalFooter: styled.div`
        padding: 10px 16px;
        border-top: 1px solid ${({ theme }) => theme.neutralPalette.gray_4};
        margin: 24px -24px -30px;
        display: flex;
        justify-content: flex-end;
    `,
};
