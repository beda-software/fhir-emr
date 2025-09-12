import styled, { css } from 'styled-components';

import { WizardFooter } from 'src/components/Wizard';
import { WIZARD_GAP, WIZARD_SIDEBAR_WIDTH } from 'src/components/Wizard/styles.ts';

import { FormFooter } from '../../FormFooter';

export const S = {
    Group: styled.div<{ $active: boolean }>`
        display: none;
        flex-direction: column;
        gap: inherit;

        ${({ $active }) =>
            $active &&
            css`
                display: flex;
            `}
    `,
    WizardFooter: styled(WizardFooter)<{ $wizardDirection: 'vertical' | 'horizontal' }>`
        .ant-modal & {
            padding: 16px 24px;
            border-top: 1px solid #f0f0f0;
            margin: 0 -24px -30px;

            ${({ $wizardDirection }) =>
                $wizardDirection === 'vertical' &&
                css`
                    margin-left: -${24 + WIZARD_SIDEBAR_WIDTH + WIZARD_GAP}px !important;
                `}
    `,
    FormFooter: styled(FormFooter)`
        padding: 0 !important;
        margin: 0 !important;
        border: 0 !important;
    `,
};
