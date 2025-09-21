import styled, { css } from 'styled-components';

import { WizardFooter } from 'src/components/Wizard';

import { FormFooter } from '../../FormFooter';

export const S = {
    Group: styled.div<{ $active: boolean }>`
        display: none;
        flex-direction: column;
        gap: inherit;
        flex: 1;

        ${({ $active }) =>
            $active &&
            css`
                display: flex;
            `}
    `,
    WizardFooter: styled(WizardFooter)``,
    FormFooter: styled(FormFooter)`
        padding: 0 !important;
        margin: 0 !important;
        border: 0 !important;
    `,
};
