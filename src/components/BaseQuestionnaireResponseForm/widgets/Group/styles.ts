import styled, { css } from 'styled-components';

import { GroupContextProps } from './context';

export const S = {
    Group: styled.div`
        display: flex;
        flex-direction: column;
        gap: 16px;
        width: 100%;
    `,
    Header: styled.div<{ $type?: GroupContextProps['type'] }>`
        display: flex;
        flex-direction: column;
        gap: 8px;
        position: relative;

        ${({ $type }) =>
            $type &&
            $type === 'section' &&
            css`
                padding: 24px 0 16px;
            `}

        ${({ $type }) =>
            $type &&
            $type === 'section-with-divider' &&
            css`
                padding: 40px 0 16px;
                margin-top: 24px;
                border-top: 1px solid ${({ theme }) => theme.primary};
            `}
    `,
};
