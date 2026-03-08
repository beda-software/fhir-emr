import { Button } from 'antd';
import styled from 'styled-components';

export const S = {
    ModalBody: styled.div`
        display: flex;
        flex-direction: column;
        gap: 12px;
    `,
    CanvasWrapper: styled.div`
        width: 100%;
        max-height: 70vh;
        overflow: auto;
        border: 1px solid ${({ theme }) => theme.neutralPalette.gray_5};
        border-radius: 6px;
        background: ${({ theme }) => theme.neutralPalette.gray_1};
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 8px;
    `,
    Canvas: styled.canvas`
        max-width: 100%;
        height: auto;
        touch-action: none;
        background: transparent;
    `,
    ToolbarRow: styled.div`
        display: flex;
        justify-content: space-between;
        gap: 12px;
        flex-wrap: wrap;
    `,
    Palette: styled.div`
        display: flex;
        gap: 8px;
    `,
    PaletteButton: styled.button<{ $color: string; $active: boolean }>`
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 2px solid ${({ $active, theme }) => ($active ? theme.primary : theme.neutralPalette.gray_4)};
        background: ${({ $color }) => $color};
        cursor: pointer;
        padding: 0;
    `,
    SizeButton: styled(Button)<{ $active: boolean }>`
        border-color: ${({ $active, theme }) => ($active ? theme.primary : theme.neutralPalette.gray_4)};
    `,
};
