import { Modal } from 'antd';
import styled from 'styled-components/macro';

export const S = {
    Modal: styled(Modal)`
        .ant-modal-content {
            padding: 0;
        }

        .ant-modal-header {
            padding: 16px 24px;
            box-shadow: inset 0px -1px 0px ${({ theme }) => theme.neutralPalette.gray_4};
            margin-bottom: 0;
        }

        .ant-modal-title {
            font-size: 16px;
            line-height: 24px;
            font-weight: 500;
        }

        .ant-modal-close {
            top: 16px;
            right: 24px;
        }

        .ant-modal-body {
            padding: 24px 24px 30px 24px;
        }

        .form__question {
            flex-direction: column;
            align-items: flex-start;
            border: 0;
            gap: 9px;
            padding: 0;
            margin-bottom: 20px;

            &:first-of-type {
                border: 0;
            }

            &:last-of-type {
                margin-bottom: 0;
            }
        }

        .form__footer,
        .ant-modal-footer {
            padding: 10px 16px;
            margin-top: 0;
            box-shadow: inset 0px 1px 0px ${({ theme }) => theme.neutralPalette.gray_4};
        }

        .form__footer {
            margin: 30px -24px -30px;
        }
    `,
};
