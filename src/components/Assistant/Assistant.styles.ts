import { CaretRightOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import styled, { css, keyframes } from 'styled-components';

export type Tone = 'idle' | 'red' | 'amber' | 'blue';
export type ActiveTone = Extract<Tone, 'red' | 'amber'>;

const recordingPulse = keyframes`
    0%, 100% { opacity: 1; }
    50% { opacity: 0.35; }
`;

export const S = {
    Root: styled.div`
        padding: 8px 0;
    `,
    ExpandedCard: styled.div<{ $tone: Tone }>`
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 14px 16px;
        border-radius: 8px;
        ${({ $tone, theme }) => {
            if ($tone === 'red') {
                return css`
                    background: ${theme.errorPalette.ep_1};
                    color: ${theme.errorPalette.ep_7};
                `;
            }
            if ($tone === 'amber') {
                return css`
                    background: ${theme.warningPalette.wp_1};
                    color: ${theme.warningPalette.wp_7};
                `;
            }
            if ($tone === 'blue') {
                return css`
                    color: ${theme.primary};
                    align-items: center;
                    flex-direction: row;
                    justify-content: center;
                    gap: 8px;
                    padding: 16px;
                `;
            }
            return css`
                background: transparent;
                border: none;
                padding: 0;
            `;
        }}
    `,
    ExpandedHeader: styled.div`
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 600;
        font-size: 14px;
    `,
    StatusDot: styled.span<{ $tone?: ActiveTone }>`
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: ${({ theme }) => theme.neutralPalette.gray_1};
        animation: ${recordingPulse} 1.4s ease-in-out infinite;
        ${({ $tone }) =>
            $tone === 'red' &&
            css`
                background: ${({ theme }) => theme.errorPalette.ep_7};
            `}
    `,
    PauseGlyph: styled.span`
        display: inline-flex;
        gap: 2px;
        color: ${({ theme }) => theme.warningPalette.wp_6};
        font-size: 0;

        &::before,
        &::after {
            content: '';
            display: block;
            width: 3px;
            height: 10px;
            background: currentColor;
            border-radius: 1px;
        }
    `,
    TimerAndWave: styled.div`
        display: flex;
        align-items: center;
        gap: 10px;
        font-variant-numeric: tabular-nums;
        font-size: 14px;
        color: ${({ theme }) => theme.neutralPalette.gray_9};
    `,
    Waveform: styled.div<{ $tone: ActiveTone }>`
        flex: 1;
        min-width: 0;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 2px;
        height: 22px;
        overflow: hidden;
        color: ${({ $tone, theme }) => ($tone === 'red' ? theme.errorPalette.ep_6 : theme.warningPalette.wp_6)};
    `,
    Bar: styled.span<{ $h: number }>`
        width: 3px;
        border-radius: 2px;
        background: currentColor;
        height: ${({ $h }) => Math.max(3, $h)}px;
    `,
    Actions: styled.div`
        display: flex;
        gap: 8px;
        width: 100%;
    `,
    SecondaryButton: styled(Button)`
        flex: 1 1 0;
        min-width: 0;
        background: ${({ theme }) => theme.neutralPalette.gray_1};
    `,
    StopButton: styled(Button)`
        flex: 1 1 0;
        min-width: 0;
        background: ${({ theme }) => theme.errorPalette.ep_6};
        border-color: ${({ theme }) => theme.errorPalette.ep_6};
        color: ${({ theme }) => theme.errorPalette.ep_1};

        &:hover,
        &:focus {
            background: ${({ theme }) => theme.errorPalette.ep_7} !important;
            border-color: ${({ theme }) => theme.errorPalette.ep_7} !important;
            color: ${({ theme }) => theme.errorPalette.ep_1} !important;
        }
    `,
    StartButton: styled(Button)`
        width: 100%;
        border: 0;
        background: ${({ theme }) => theme.primaryPalette.bcp_1};
        color: ${({ theme }) => theme.primary};
        height: 40px;
        font-weight: 500;

        &:hover,
        &:focus {
            background: ${({ theme }) => theme.primaryPalette.bcp_1} !important;
            color: ${({ theme }) => theme.primary} !important;
        }
    `,
    ProcessingLabel: styled.span`
        font-weight: 500;
        font-size: 14px;
    `,
    FoldedWrapper: styled.div`
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
    `,
    FoldedIdleTile: styled.button`
        width: 32px;
        height: 32px;
        border-radius: 6px;
        border: 1px solid ${({ theme }) => theme.primaryPalette.bcp_3};
        background: ${({ theme }) => theme.primaryPalette.bcp_1};
        color: ${({ theme }) => theme.primary};
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 16px;
        padding: 0;

        &:hover {
            border-color: ${({ theme }) => theme.primary};
        }
    `,
    FoldedActiveTile: styled.div<{ $tone: ActiveTone }>`
        width: 48px;
        border-radius: 10px;
        overflow: hidden;
        border: 1px solid
            ${({ $tone, theme }) => ($tone === 'red' ? theme.errorPalette.ep_3 : theme.warningPalette.wp_3)};
        background: ${({ $tone, theme }) => ($tone === 'red' ? theme.errorPalette.ep_6 : theme.warningPalette.wp_6)};
        color: ${({ $tone, theme }) => ($tone === 'red' ? theme.errorPalette.ep_1 : theme.warningPalette.wp_1)};
        display: flex;
        flex-direction: column;
        align-items: stretch;
    `,
    FoldedTop: styled.div`
        padding: 8px 4px 6px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        font-size: 11px;
        font-variant-numeric: tabular-nums;
    `,
    FoldedMiniWave: styled.div`
        display: flex;
        align-items: center;
        gap: 1px;
        height: 14px;
        color: inherit;
    `,
    FoldedDivider: styled.div<{ $tone: ActiveTone }>`
        height: 1px;
        background: ${({ $tone, theme }) => ($tone === 'red' ? theme.errorPalette.ep_5 : theme.warningPalette.wp_4)};
    `,
    FoldedBottom: styled.button`
        background: transparent;
        border: 0;
        color: inherit;
        padding: 8px 0;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 12px;
    `,
    FoldedProcessing: styled.div`
        width: 48px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        color: ${({ theme }) => theme.primary};
        font-size: 12px;
        font-variant-numeric: tabular-nums;
        font-weight: 600;
    `,
    FoldedLabel: styled.div<{ $tone: Tone }>`
        font-size: 10px;
        line-height: 14px;
        font-weight: 500;
        color: ${({ theme, $tone }) => {
            if ($tone === 'red') {
                return theme.errorPalette.ep_7;
            }
            if ($tone === 'amber') {
                return theme.warningPalette.wp_7;
            }
            if ($tone === 'blue') {
                return theme.primary;
            }
            return theme.neutralPalette.gray_13;
        }};
    `,
    HeaderPill: styled.div<{ $tone: Tone }>`
        display: inline-flex;
        align-items: center;
        gap: 8px;
        height: 42px;
        min-width: 44px;
        padding: 0px 12px;
        border-radius: 6px;
        font-size: 14px;
        line-height: 22px;
        font-variant-numeric: tabular-nums;
        ${({ $tone, theme }) => {
            if ($tone === 'red') {
                return css`
                    background: ${theme.errorPalette.ep_6};
                    color: ${theme.errorPalette.ep_1};
                `;
            }
            if ($tone === 'amber') {
                return css`
                    background: ${theme.warningPalette.wp_1};
                    color: ${theme.warningPalette.wp_7};
                `;
            }
            if ($tone === 'blue') {
                return css`
                    color: ${theme.primary};
                `;
            }
            return css`
                background: ${theme.primaryPalette.bcp_1};
                color: ${theme.primary};
                width: 32px;
                justify-content: center;
            `;
        }}
    `,
    HeaderIconButton: styled.button`
        width: 100%;
        height: 100%;
        background: transparent;
        border: 0;
        color: inherit;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
    `,
    HeaderInlineButton: styled.button<{ $tone: ActiveTone }>`
        border: 0;
        padding: 0;
        border-radius: 4px;
        background: inherit;
        color: inherit;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
    `,
    HeaderMiniWave: styled.div`
        display: inline-flex;
        align-items: center;
        gap: 1px;
        height: 24px;
        color: currentColor;
    `,
    StopSquare: styled.span<{ $size?: number }>`
        display: inline-block;
        width: ${({ $size = 8 }) => $size}px;
        height: ${({ $size = 8 }) => $size}px;
        background: currentColor;
        border-radius: 1px;
    `,
    PlayIcon: styled(CaretRightOutlined)`
        font-size: 16px;
    `,
};
