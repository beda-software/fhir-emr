import { t } from '@lingui/macro';
import { Empty } from 'antd';
import { Patient } from 'fhir/r4b';
import { ReactNode } from 'react';

import { ViewChartKind } from 'src/services';
import { ViewChart, ViewChartConfig } from 'src/uberComponents/ViewChart';

import { buildBloodPressureChart, buildNumericObservationChart, ObservationChartRow } from './observationChart';
import { AIChartViewChartWidgetConfig } from './utils';

const CHART_BUILDERS: Record<ViewChartKind, (rows: ObservationChartRow[]) => ViewChartConfig<ObservationChartRow>> = {
    numeric: buildNumericObservationChart,
    'blood-pressure': buildBloodPressureChart,
};

interface Props {
    patient: Patient;
    widget: AIChartViewChartWidgetConfig;
    renderChart?: (chart: ReactNode, data: ObservationChartRow[]) => ReactNode;
}

export function AIChartViewChart({ patient, widget, renderChart }: Props) {
    const buildChart = CHART_BUILDERS[widget.chartKind];

    return (
        <ViewChart<ObservationChartRow>
            source={{ type: 'ViewDefinition', reference: `ViewDefinition/${widget.viewDefinition}` }}
            parameters={[{ name: 'patient', valueReference: { reference: `Patient/${patient.id}` } }]}
            chart={(rows) => ({
                ...buildChart(rows),
                empty: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t`No data`} />,
            })}
            renderChart={renderChart ? (chart, _config, data) => renderChart(chart, data) : undefined}
        />
    );
}
