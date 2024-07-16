import styled from 'styled-components';

export const S = {
    Calendar: styled.div`
        min-width: 800px;
        --fc-button-bg-color: ${({ theme }) => theme.primary};
        --fc-button-border-color: ${({ theme }) => theme.primary};
        --fc-button-text-color: #fff;

        --fc-button-hover-bg-color: ${({ theme }) => theme.primaryPalette.bcp_7};
        --fc-button-hover-border-color: ${({ theme }) => theme.primaryPalette.bcp_7};

        --fc-button-active-bg-color: ${({ theme }) => theme.primaryPalette.bcp_5};
        --fc-button-active-border-color: ${({ theme }) => theme.primaryPalette.bcp_5};

        --fc-today-bg-color: ${({ theme }) => theme.primaryPalette.bcp_1};
        --fc-border-color: ${({ theme }) => theme.neutralPalette.gray_4};

        /* --fc-non-business-color: rgba(218, 218, 218, 0.2); */
        --fc-now-indicator-color: ${({ theme }) => theme.primary};

        --fc-page-bg-color: ${({ theme }) => theme.neutralPalette.gray_4};

        .fc-toolbar-title {
            font-weight: 400;
            font-size: 24px;
            line-height: 32px;
            color: ${({ theme }) => theme.neutralPalette.gray_13};
        }

        .fc-event._cancelled {
            background-color: #f6bf26;
        }

        .fc-event._booked {
            background-color: ${({ theme }) => theme.primary};
        }

        .fc-v-event {
            background-color: ${({ theme }) => theme.primaryPalette.bcp_8};
        }

        .fc-button {
            transition: color 0.2s;
            text-transform: none;
            height: 32px;
            display: inline-flex;
            justify-content: center;
            align-items: center;
            padding: 0 16px;
            border-radius: 6px;
            font-size: 14px;
            line-height: 32px;
            font-weight: 400;
            margin: 0 !important;
            box-shadow: none !important;
            transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
        }

        .fc-prev-button,
        .fc-next-button {
            width: 32px;
        }

        .fc-toolbar-chunk {
            display: flex;
            gap: 32px;
        }

        .fc-col-header-cell {
            color: ${({ theme }) => theme.neutralPalette.gray_13};
        }

        .fc-col-header-cell-cushion {
            color: ${({ theme }) => theme.neutralPalette.gray_13};
            font-size: 14px;
            line-height: 22px;
            font-weight: 500;
        }

        .fc-scrollgrid {
            border: 0;
            background-color: ${({ theme }) => theme.antdTheme?.colorBgContainer};
            border: 1px solid ${({ theme }) => theme.antdTheme?.colorBorderSecondary};
            border-radius: 10px;
            overflow: hidden;
        }

        .fc-col-header thead tr {
            background-color: ${({ theme }) => theme.neutralPalette.gray_3};
        }

        .fc-timegrid-slot-minor {
            border-top-style: solid;
        }

        .fc-theme-standard td,
        .fc-theme-standard th {
            border-right-width: 0;
        }

        .fc-scrollgrid-section-liquid > td {
            border-bottom-width: 0;
        }

        .fc-col-header,
        .fc-timegrid-body,
        .fc-timegrid-slots > table,
        .fc-timegrid-cols > table {
            width: 100% !important;
        }

        .fc-timegrid-event-harness-inset .fc-timegrid-event {
            margin: 0 -3px 0 -2px;
            font-size: 14px;
            line-height: 22px;
            border: 0;
        }

        .fc-timegrid-slot-label-cushion {
            text-transform: lowercase;
        }
    `,
};
