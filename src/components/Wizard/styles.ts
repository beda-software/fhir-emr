import styled, { css } from 'styled-components';

import { Title } from '../Typography';

export const WIZARD_SIDEBAR_WIDTH = 246;
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
        gap: ${WIZARD_GAP}px 0;

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
            gap: 0 24px;
            
            .ant-steps-item-tail {
                display: none !important;
            }
        `}
    `,
    StepsContainer: styled.div<{ $direction: 'horizontal' | 'vertical' }>`
        ${({ $direction }) => $direction === 'vertical' && css`
            width: ${WIZARD_SIDEBAR_WIDTH}px;
        `}
    `,
    Content: styled.div<{ $direction: 'horizontal' | 'vertical' }>`
        display: flex;
        flex-direction: column;
        gap: 24px 0;
        
        ${({ $direction }) => $direction === 'vertical' && css`
            flex: 1;
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
        padding-top: 20px;
        
        .app-wizard._vertical & {
            margin-left: -${WIZARD_SIDEBAR_WIDTH + WIZARD_GAP}px;
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
