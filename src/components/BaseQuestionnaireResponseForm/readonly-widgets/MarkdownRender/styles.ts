import styled from 'styled-components';

export const S = {
    WrapperMDRender: styled.div`
        padding: 9px 0;
        gap: 4px 16px;
        margin: 0;
        font-size: 14px;
        line-height: 22px;
        margin-bottom: 0;
        word-break: break-word;

        hr {
            border: none;
            border-top: 1px solid ${({ theme }) => theme.neutralPalette.gray_4};
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
            margin-top: 0;
            margin-bottom: 0.5em;
            font-weight: 500;
        }

        h1 {
            font-size: 28px;
        }
        h2 {
            font-size: 21px;
        }
        h3 {
            font-size: 16px;
        }
        h4 {
            font-size: 14px;
        }

        h5 {
            font-size: 12px;
        }
        h6 {
            font-size: 10px;
        }

        ul.contains-task-list {
            list-style-type: none;
            padding-left: 0;
        }

        li.task-list-item {
            display: flex;
            align-items: center;
            gap: 8px;
            margin: 0;
        }

        .admonition {
            margin: 4px 0;
            border-left: 3px solid gray;
            overflow: hidden;
            border-radius: 6px;
            padding: 8px 12px;
        }

        .admonition-content {
            margin: 0;
            padding: 4px 8px;
            border-radius: 6px;
            background: ${({ theme }) => theme.neutralPalette.gray_1};

            p {
                margin: 0;
            }
        }

        .admonition.note {
            border-color: #b9bbc6;
            background: #e8e8ec;
        }

        .admonition.tip {
            border-color: #3db9cf;
            background: #caf1f6;
        }

        .admonition.danger {
            border-color: #eb8e90;
            background: #ffdbdc;
        }

        .admonition.info {
            border-color: #65ba74;
            background: #daf1db;
        }

        .admonition.caution {
            border-color: #e2a336;
            background: #ffee9c;
        }

        .md-render-table-wrapper {
            width: 100%;
            border-radius: 10px;
            border: 1px solid ${({ theme }) => theme.neutralPalette.gray_4};
            overflow: hidden;
            margin: 16px 0;

            table {
                width: 100%;
                padding: 16px;
                border-collapse: collapse;
                border: none;
            }

            thead {
                background-color: ${({ theme }) => theme.neutralPalette.gray_3};
            }

            tbody {
                background-color: ${({ theme }) => theme.neutralPalette.gray_1};
            }

            th,
            td {
                height: 34px;
                border: 1px solid ${({ theme }) => theme.neutralPalette.gray_4};
                text-align: left;
            }

            th {
                padding: 4px 8px;
            }

            td {
                background: ${({ theme }) => theme.neutralPalette.gray_1};
                padding: 4px;
            }

            thead th,
            tbody tr:first-child td {
                border-top: none;
            }

            tbody tr:last-child td {
                border-bottom: none;
            }

            tr td:first-child,
            tr th:first-child {
                border-left: none;
            }

            tr td:last-child,
            tr th:last-child {
                border-right: none;
            }
        }
    `,
};
