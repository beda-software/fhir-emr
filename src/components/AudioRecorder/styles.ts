import { Button } from 'antd';
import styled, { css } from 'styled-components';

import { Text } from 'src/components/Typography';

export const S = {
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
    Audio: styled.audio`
        height: 52px;
        width: 100%;
    `,
    File: styled.div`
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 7px;
    `,
    Button: styled(Button)`
        padding: 0;
    `,
};
