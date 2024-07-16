import styled from 'styled-components';

import { Spinner } from 'src/components/Spinner';

export const S = {
    Spinner: styled(Spinner)`
        position: absolute;
        left: 50%;
        margin-left: -44px;
    `,
    Content: styled.div`
        position: relative;
    `,
};
