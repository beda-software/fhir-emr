import { Alert, Spin } from 'antd';
import styled from 'styled-components';

export const S = {
    Loading: styled(Spin)`
        display: block;
        padding: 24px;
    `,
    Failure: styled(Alert)`
        margin: 24px;
    `,
    Grid: styled.div<{ $columns?: number; $gap?: number | string }>`
        display: grid;
        width: 100%;
        gap: ${({ $gap }) => ($gap == null ? '16px' : typeof $gap === 'number' ? `${$gap}px` : $gap)};
        grid-template-columns: ${({ $columns }) =>
            $columns ? `repeat(${$columns}, minmax(0, 1fr))` : 'repeat(auto-fit, minmax(320px, 1fr))'};

        @media (max-width: 1024px) {
            grid-template-columns: minmax(0, 1fr);
        }
    `,
};
