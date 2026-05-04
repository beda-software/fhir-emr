import { css } from 'styled-components';

export const markdownContentStyles = css`
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

    .md-render-table-wrapper {
        width: 100%;
        border-radius: 10px;
        border: 1px solid ${({ theme }) => theme.neutralPalette.gray_4};
        overflow: hidden;
        margin: 16px 0;
    }

    .md-render-table-wrapper table {
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

    .admonition {
        margin: 4px 0;
        border-left: 3px solid ${({ theme }) => theme.neutralPalette.gray_9}66;
        overflow: hidden;
        border-radius: 6px;
        padding: 8px 12px;
        width: 100%;
    }

    .admonition-content {
        margin: 0;
        padding: 4px 8px;
        border-radius: 6px;
        background: ${({ theme }) => theme.neutralPalette.gray_1};

        p:last-child {
            margin: 0;
        }
    }

    .admonition:is([class^='layout-'], [class*=' layout-']) {
        border: none;
        margin-top: 0;
    }

    .admonition:not([class^='layout-'], [class*=' layout-']) {
        display: inline-block;
        margin-top: 12px;
        margin-bottom: 12px;
    }

    .admonition:is([class$='-card'], [class*='-card ']) {
        border: none;
        padding: 16px;
    }

    .admonition:is([class^='layout-'], [class*=' layout-']) > .admonition-content {
        padding: 0;
    }

    .admonition.layout-columns > .admonition-content {
        column-count: 2;
        column-gap: 40px;
        column-rule: 1px solid ${({ theme }) => theme.neutral.dividers};
    }

    .admonition:is([class$='-card'], [class*='-card ']) > .admonition-content {
        align-items: start;
        padding: 0;
    }

    .admonition:is([class$='-card'], [class*='-card ']) > .admonition-content {
        & :is(h1, h2, h3, h4, h5, h6) {
            column-span: all;
            padding: 8px 16px;
        }

        :first-child:is(h1, h2, h3, h4, h5, h6) {
            padding: 0 16px 16px 16px;
            border-radius: 6px 6px 0 0;
        }
    }

    .admonition.note {
        background-color: ${({ theme }) => theme.neutralPalette.gray_5};
    }

    .admonition.tip {
        background-color: ${({ theme }) => theme.antdTheme?.colorInfoBorder};
    }

    .admonition.info-card {
        background-color: ${({ theme }) => theme.antdTheme?.colorInfoBorder};

        & :is(h1, h2, h3, h4, h5, h6) {
            background-color: ${({ theme }) => theme.antdTheme?.colorInfoBorder};
        }
    }

    .admonition.info {
        background-color: ${({ theme }) => theme.antdTheme?.colorSuccessBorder};
    }

    .admonition.success-card {
        background-color: ${({ theme }) => theme.antdTheme?.colorSuccessBorder};

        & :is(h1, h2, h3, h4, h5, h6) {
            background-color: ${({ theme }) => theme.antdTheme?.colorSuccessBorder};
        }
    }

    .admonition.caution {
        background-color: ${({ theme }) => theme.antdTheme?.colorWarningBorder};
    }

    .admonition.warning-card {
        background-color: ${({ theme }) => theme.antdTheme?.colorWarningBorder};

        & :is(h1, h2, h3, h4, h5, h6) {
            background-color: ${({ theme }) => theme.antdTheme?.colorWarningBorder};
        }
    }

    .admonition.danger {
        background-color: ${({ theme }) => theme.antdTheme?.colorErrorBorder};
    }

    .admonition.error-card {
        background-color: ${({ theme }) => theme.antdTheme?.colorErrorBorder};

        & :is(h1, h2, h3, h4, h5, h6) {
            background-color: ${({ theme }) => theme.antdTheme?.colorErrorBorder};
        }
    }

    .admonition.info-alert {
        background-color: ${({ theme }) => theme.antdTheme?.colorInfoBg};
        border: 1px solid ${({ theme }) => theme.antdTheme?.colorInfoBorder};
    }

    .admonition.success-alert {
        background-color: ${({ theme }) => theme.antdTheme?.colorSuccessBg};
        border: 1px solid ${({ theme }) => theme.antdTheme?.colorSuccessBorder};
    }

    .admonition.warning-alert {
        background-color: ${({ theme }) => theme.antdTheme?.colorWarningBg};
        border: 1px solid ${({ theme }) => theme.antdTheme?.colorWarningBorder};
    }

    .admonition.error-alert {
        background-color: ${({ theme }) => theme.antdTheme?.colorErrorBg};
        border: 1px solid ${({ theme }) => theme.antdTheme?.colorErrorBorder};
    }

    .admonition:is([class$='-alert'], [class*='-alert ']) > .admonition-content {
        background-color: transparent;
    }
`;
