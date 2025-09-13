import styled, { css } from 'styled-components';

import { Title } from '../Typography';
import { PATIENT_DOCUMENT_PADDING } from 'src/containers/PatientDetails/PatientDocument/PatientDocument.styles.ts';

export const WIZARD_SIDEBAR_WIDTH = 294;
export const WIZARD_GAP = 24;

const activeColors = css`
    background-color: ${({ theme }) => theme.primaryPalette.bcp_6};
    border-color: ${({ theme }) => theme.primaryPalette.bcp_6};
    
    * {
        color: ${({ theme }) => theme.neutralPalette.gray_1};
    }

    .ant-steps-item-container[role='button']:hover & {
        background-color: ${({ theme }) => theme.primaryPalette.bcp_6};
        border-color: ${({ theme }) => theme.primaryPalette.bcp_6};

        * {
            color: ${({ theme }) => theme.neutralPalette.gray_1};
        }
    }
`

const processColors = css`
    background-color: ${({ theme }) => theme.primaryPalette.bcp_1};
    border-color: ${({ theme }) => theme.primaryPalette.bcp_1};
    
    * {
        color: ${({ theme }) => theme.primaryPalette.bcp_6};
    }

    .ant-steps-item-container[role='button']:hover & {
        background-color: ${({ theme }) => theme.primaryPalette.bcp_1};
        border-color: ${({ theme }) => theme.primaryPalette.bcp_6};

        * {
            color: ${({ theme }) => theme.primaryPalette.bcp_6};
        }
    }
`

const disabledColors = css`
    background-color: ${({ theme }) => theme.neutralPalette.gray_4};
    border-color: ${({ theme }) => theme.neutralPalette.gray_4};
    
    * {
        color: ${({ theme }) => theme.neutralPalette.gray_7};
    }

    ant-steps-item-container[role='button']:hover & {
        background-color: ${({ theme }) => theme.neutralPalette.gray_4};
        border-color: ${({ theme }) => theme.neutralPalette.gray_4};

        * {
            color: ${({ theme }) => theme.neutralPalette.gray_7};
        }
    }
`

const errorColors = css`
    background-color: ${({ theme }) => theme.antdTheme?.red6};
    border-color: ${({ theme }) => theme.antdTheme?.red6};

    * {
        color: ${({ theme }) => theme.neutralPalette.gray_1};
    }

    .ant-steps-item-container[role='button']:hover & {
        background-color: ${({ theme }) => theme.antdTheme?.red7};
        border-color: ${({ theme }) => theme.antdTheme?.red7};

        * {
            color: ${({ theme }) => theme.neutralPalette.gray_1};
        }
    }
`

const finishColors = css`
    background-color: ${({ theme }) => theme.antdTheme?.green6};
    border-color: ${({ theme }) => theme.antdTheme?.green6};

    * {
        color: ${({ theme }) => theme.neutralPalette.gray_1};
    }

    .ant-steps-item-container[role='button']:hover & {
        background-color: ${({ theme }) => theme.antdTheme?.green7};
        border-color: ${({ theme }) => theme.antdTheme?.green7};

        * {
            color: ${({ theme }) => theme.neutralPalette.gray_1};
        }
    }
`

export const S = {
    Container: styled.div<{ $labelPlacement: 'vertical' | 'tooltip'; $direction: 'horizontal' | 'vertical' }>`
        display: flex;
        flex-direction: column;
        gap: 24px 0;
        position: relative;
        padding-bottom: 73px;

        .ant-steps {
            overflow-x: auto;
            scrollbar-width: thin;
        }

        .ant-steps-item-tail:after {
            background-color: ${({ theme }) => theme.neutralPalette.gray_4} !important;
        }

        .ant-steps-item-title {
            font-size: 14px;
            line-height: 24px !important;
            color: ${({ theme }) => theme.neutral.primaryText} !important;
        }

        .ant-steps-item-description {
            line-height: 22px !important;
            margin-top: 4px;
            color: ${({ theme }) => theme.neutral.secondaryText} !important;
        }

        .ant-steps-item-icon {
            width: auto;
            margin-right: 8px !important;
        }

        .ant-modal-body & {
            margin: -24px -24px -30px -24px;
        }

        .app-patient-document & {
            margin: 0 -${PATIENT_DOCUMENT_PADDING}px -${PATIENT_DOCUMENT_PADDING}px;
        }

        ${({ $labelPlacement }) =>
            $labelPlacement === 'tooltip' &&
            css`
                .ant-steps-item-content {
                    width: 0 !important;
                    margin-top: 0 !important;
                }

                .ant-steps-item-icon {
                    margin-inline-start: 0 !important;
                }

                .ant-steps-item-tail {
                    margin-inline-start: 16px !important;
                }
            `}

        ${({ $direction }) => $direction === 'vertical' && css`
            flex-direction: row;
            gap: 0 ${WIZARD_GAP}px;

            .ant-steps-item-tail {
                display: none !important;
            }
        `}
    `,
    StepsContainer: styled.div<{ $direction: 'horizontal' | 'vertical' }>`
        padding: 24px 24px 0;
        
        ${({ $direction }) => $direction === 'vertical' && css`
            width: ${WIZARD_SIDEBAR_WIDTH}px;
            padding: 24px;
            background-color: ${({ theme }) => theme.neutralPalette.gray_2};
        `}

        .ant-modal-body &,
        .app-patient-document & {
            background-color: ${({ theme }) => theme.neutralPalette.gray_3};
        }
    `,
    Content: styled.div<{ $direction: 'horizontal' | 'vertical' }>`
        display: flex;
        flex-direction: column;
        gap: 24px 0;
        padding: 0 24px 24px;
        
        ${({ $direction }) => $direction === 'vertical' && css`
            flex: 1;
            padding: 24px 0;

            .ant-modal-body &,
            .app-patient-document & {
                padding-right: 24px;
            }
        `}
    `,
    Title: styled(Title)`
        margin-bottom: 0 !important;
    `,
    Icon: styled.div<{ $active: boolean; $status?: 'wait' | 'process' | 'finish' | 'error', $size?: 'small' | 'default', $disabled?: boolean }>`
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid ${({ theme }) => theme.primaryPalette.bcp_1};
        transition: all 0.2s;
        
        ${processColors}

        ${({ $status }) => $status === 'process' && processColors}

        ${({ $status }) => $status === 'finish' && finishColors}

        ${({ $status }) => $status === 'error' && errorColors}

        ${({ $status }) => $status === 'wait' && disabledColors}

        ${({ $active }) => $active && activeColors}
        
        ${({ $disabled }) => $disabled && disabledColors}
        
        ${({ $size }) => $size === 'small' && css`
            width: 24px;
            height: 24px;
        `}
    `,
    Footer: styled.div`
        display: flex;
        justify-content: space-between;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 20px 24px;

        .app-wizard._vertical &,
        .app-patient-document & {
            padding: 20px 0 20px 24px;
            border-top: 1px solid #f0f0f0;
        }

        .ant-modal & {
            padding: 20px 24px !important;
            border-top: 1px solid #f0f0f0;
        }
    `,
    ControlsLeft: styled.div`
        display: flex;
        gap: 0 8px;
    `,
    ControlsRight: styled.div`
        display: flex;
        gap: 0 8px;
    `,
};
