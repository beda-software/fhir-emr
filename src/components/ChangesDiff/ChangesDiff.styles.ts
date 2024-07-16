import styled from 'styled-components';

import { Text } from 'src/components/Typography';

export const S = {
    Container: styled.div`
        padding: 9px 0 0;
        gap: 4px 16px;
        margin: 0 0 32px;
        font-size: 14px;
        line-height: 22px;
    `,
    Header: styled(Text)`
        display: flex;
        justify-content: space-between;
        gap: 16px;
        padding-bottom: 8px;
        margin-bottom: 8px;
        border-bottom: 1px solid ${({ theme }) => theme.neutralPalette.gray_4};
    `,
    DiffRow: styled.div`
        display: flex;
        justify-content: space-between;
    `,
    DiffItem: styled(Text)`
        width: 50%;
        padding-left: 22px;
        background-color: ${({ theme }) =>
            theme.mode === 'dark' ? 'rgba(110,118,129,0.3)' : 'rgba(234, 238, 242, 0.5)'};
        position: relative;

        &._deleted {
            background-color: ${({ theme }) => (theme.mode === 'dark' ? 'rgba(248,81,73,0.3)' : '#ffebe9')};
        }

        &._added {
            background-color: ${({ theme }) => (theme.mode === 'dark' ? 'rgba(63,185,80,0.3)' : '#e6ffec')};
        }

        &:before {
            display: flex;
            justify-content: center;
            position: absolute;
            left: 0;
            top: 0;
            width: 22px;
            height: 22px;
            line-height: 22px;
        }

        &._deleted:before {
            content: '-';
        }

        &._added:before {
            content: '+';
        }
    `,
};
