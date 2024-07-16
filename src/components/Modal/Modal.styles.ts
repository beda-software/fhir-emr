import { Modal } from 'antd';
import styled from 'styled-components';

export const S = {
    Modal: styled(Modal)`
        top: 40px;
        padding-bottom: 40px;

        .ant-modal-content {
            padding: 0;
        }

        .ant-modal-header {
            padding: 16px 24px;
            box-shadow: none;
            border-bottom: 1px solid ${({ theme }) => theme.antdTheme?.colorBorderSecondary};
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

        .ant-modal-footer {
            padding: 10px 16px;
            margin-top: 0;
            border-top: 1px solid ${({ theme }) => theme.antdTheme?.colorBorderSecondary};
        }
    `,
};
