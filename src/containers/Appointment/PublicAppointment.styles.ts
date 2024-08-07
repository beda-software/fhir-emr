import styled from 'styled-components';

import { BasePageHeader } from 'src/components/BaseLayout';

export const S = {
    Header: styled(BasePageHeader)``,
    Content: styled.div`
        width: 540px;
        background-color: ${({ theme }) => theme.antdTheme?.colorBgContainer};
        border: 1px solid ${({ theme }) => theme.antdTheme?.colorBorderSecondary};
        padding: 32px;
        border-radius: 10px;
    `,
};
