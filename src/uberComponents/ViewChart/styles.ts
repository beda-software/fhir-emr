import { Alert, Spin } from 'antd';
import styled from 'styled-components';

export const S = {
    Loading: styled(Spin)`
        display: block;
        padding: 24px;
    `,
    Failure: styled(Alert)`
        margin: 24px;
    `,
};
