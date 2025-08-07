import styled from 'styled-components';

import { WizardFooter } from 'src/components/Wizard';

export const S = {
    Footer: styled(WizardFooter)`
        align-items: flex-end;
        justify-content: space-between;

        & > :first-child {
            padding-bottom: 10px 0;
            margin: 24px 0 0;
        }

        .ant-modal & > :first-child {
            padding: 10px 16px;
            border-top: 1px solid ${({ theme }) => theme.antdTheme?.colorBorderSecondary};
            margin: 30px -24px -30px;
        }
    `,
};
