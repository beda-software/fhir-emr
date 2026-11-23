import styled from 'styled-components';

export const S = {
    // Labels above the inputs; the fields share each row and the Search button ends the last one.
    SearchFields: styled.div`
        display: flex;
        flex-wrap: wrap;
        align-items: flex-end;
        gap: 16px;

        .ant-form-item {
            flex: 1 1 140px;
            margin-bottom: 0;
        }

        .ant-form-item:has(.ant-picker-range),
        .ant-form-item:last-child {
            flex: none;
        }
    `,
};
