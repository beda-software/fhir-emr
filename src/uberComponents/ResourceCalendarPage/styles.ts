import styled from 'styled-components';

export const S = {
    Container: styled.div`
        display: flex;
        padding: 8px 10px;
        align-items: center;
    `,
    TextBlock: styled.div`
        display: flex;
        flex-direction: column;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    `,
    Title: styled.div`
        font-size: 12px;
        font-weight: 500;
    `,
    Timebox: styled.div`
        font-weight: 400;
        font-size: 10px;
    `,
};
