import styled from 'styled-components';

import { Button } from 'antd';

export const S = {
    Actions: styled.div`
        display: flex;
        gap: 8px 16px;
    `,
    LinkButton: styled(Button)`
        padding: 0;
    `,
    BatchActionsContainer: styled.div`
        display: flex;
        gap: 10px 16px;
        align-items: center;
        flex-wrap: wrap;
    `,
    BatchActions: styled.div`
        display: flex;
        gap: 10px 8px;
        flex-wrap: wrap;
    `,
};
