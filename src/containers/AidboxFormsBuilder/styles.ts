import styled from 'styled-components';

export const S = {
    Container: styled.div`
        height: 100%;
        position: relative;

        iframe {
            width: 100%;
            height: 100%;
            border: 0;
        }
    `,
    Content: styled.div`
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: -64px;
        z-index: 1;
    `,
};
