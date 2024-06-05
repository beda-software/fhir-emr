import styled from 'styled-components/macro';

import { footerStyles } from '../BaseQuestionnaireResponseForm/BaseQuestionnaireResponseForm.styles';

export const S = {
    Header: styled.div``,
    Count: styled.span`
        color: #36f;
    `,
    Footer: styled.div`
        ${footerStyles}

        justify-content: space-between;
    `,
};
