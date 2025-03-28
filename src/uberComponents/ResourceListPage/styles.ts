import { Button } from 'antd';
import styled from 'styled-components';

import { mobileWidth } from 'src/theme/utils';

export const S = {
    Actions: styled.div`
        display: flex;
        gap: 8px 16px;

        @media screen and (max-width: ${() => `${mobileWidth - 1}px`}) {
            gap: 2px 16px;
            flex-wrap: wrap;
        }
    `,
    LinkButton: styled(Button)`
        padding: 0;
    `,
    BatchActionsContainer: styled.div`
        display: flex;
        flex-direction: row;
        gap: 10px 16px;
        align-items: center;
        flex-wrap: wrap;

        @media screen and (max-width: ${() => `${mobileWidth - 1}px`}) {
            flex-direction: column;
            align-items: stretch;
        }
    `,
    BatchActions: styled.div`
        display: flex;
        gap: 10px 8px;
        flex-wrap: wrap;

        @media screen and (max-width: ${() => `${mobileWidth - 1}px`}) {
            gap: 10px 16px;

            & > * {
                width: calc(50% - 8px);
            }
        }
    `,
    ResetSelection: styled.div`
        margin-left: 8px;

        @media screen and (max-width: ${() => `${mobileWidth - 1}px`}) {
            margin-left: 0;

            & > * {
                width: 100%;
            }
        }
    `,
    SelectAll: styled.div`
        @media screen and (max-width: ${() => `${mobileWidth - 1}px`}) {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            height: 32px;
            padding: 0 16px;
        }
    `,
    CheckboxAll: styled.div`
        display: none;

        @media screen and (max-width: ${() => `${mobileWidth - 1}px`}) {
            display: block;
        }
    `,
    Label: styled.div`
        display: flex;
        gap: 0 8px;
        align-items: center;
    `,
};
