import styled, { css } from 'styled-components';

export const S = {
    CheckboxWrapper: styled.div<{ $hasError?: boolean }>`
        .ant-checkbox-wrapper {
            ${({ $hasError }) =>
                $hasError &&
                css`
                    color: ${({ theme }) => theme.error};
                `}
        }

        .ant-checkbox-inner {
            ${({ $hasError }) =>
                $hasError &&
                css`
                    border-color: ${({ theme }) => theme.error};
                `}
        }
    `,
};
