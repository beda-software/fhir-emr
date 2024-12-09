import { Button } from 'antd';
import styled from 'styled-components';

export const S = {
    Container: styled.div`
        border-radius: 10px;
        padding: 12px 8px;
        border: 1px solid ${({ theme }) => theme.neutralPalette.gray_4};
    `,
    Button: styled(Button)`
        width: 100%;
    `,
};
