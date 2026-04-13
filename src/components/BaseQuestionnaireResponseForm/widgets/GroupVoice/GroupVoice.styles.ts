import styled, { keyframes } from 'styled-components';

const speakingBar = keyframes`
    0%,
    100% {
        transform: scaleY(0.35);
        opacity: 0.65;
    }

    50% {
        transform: scaleY(1);
        opacity: 1;
    }
`;

export const S = {
    Root: styled.div`
        margin: 0 0 32px;
    `,
    Row: styled.div`
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    `,
    Speaking: styled.span`
        display: inline-flex;
        align-items: flex-end;
        gap: 4px;
        height: 16px;
    `,
    Bar: styled.span`
        width: 4px;
        height: 14px;
        border-radius: 2px;
        background: currentColor;
        transform-origin: bottom center;
        animation: ${speakingBar} 0.55s ease-in-out infinite;

        &:nth-child(2) {
            animation-delay: 0.12s;
        }

        &:nth-child(3) {
            animation-delay: 0.24s;
        }
    `,
};
