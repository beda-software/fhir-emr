import styled from 'styled-components';

import { footerStyles } from 'src/components/BaseQuestionnaireResponseForm/BaseQuestionnaireResponseForm.styles';
import { WizardFooter } from 'src/components/Wizard';

export const S = {
    Footer: styled(WizardFooter)`
        ${footerStyles}
        align-items: flex-end;
        justify-content: space-between;

        & > :first-child {
            padding-bottom: 10px;
        }
    `,
};
