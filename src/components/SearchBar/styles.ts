import styled, { css } from 'styled-components';

import { mobileWidth } from 'src/theme/utils';

export const S = {
    SearchBar: styled.div<{ $showInDrawerOnMobile?: boolean }>`
        position: relative;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
        flex-wrap: wrap;

        .ant-input-search,
        .ant-picker,
        .react-select__control {
            width: 270px;
        }

        ${({ $showInDrawerOnMobile }) =>
            $showInDrawerOnMobile &&
            css`
                @media screen and (max-width: ${() => `${mobileWidth - 1}px`}) {
                    display: none;
                }
            `}
    `,
    MobileFilters: styled.div<{ $level: 1 | 2; $showInDrawerOnMobile?: boolean }>`
        position: absolute;
        right: 24px;
        top: 24px;

        ${({ $level }) =>
            $level === 2 &&
            css`
                right: 0;
                top: 0;
            `}

        ${({ $showInDrawerOnMobile }) =>
            $showInDrawerOnMobile &&
            css`
                @media screen and (min-width: ${() => `${mobileWidth}px`}) {
                    display: none;
                }
            `}
    `,
    LeftColumn: styled.div`
        display: flex;
        flex-direction: row;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px 8px;
    `,
};
