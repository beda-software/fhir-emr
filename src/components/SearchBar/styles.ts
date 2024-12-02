import styled from 'styled-components';

export const S = {
    Container: styled.div`
        position: relative;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
        flex-wrap: wrap;

        .ant-input-search,
        .ant-picker,
        .react-select__control {
            width: 270px;
        }
    `,
    LeftColumn: styled.div`
        display: flex;
        flex-direction: row;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px 8px;
    `,
};
