import { formatError, RenderRemoteData } from '@beda.software/fhir-react';

import type { ChartDatumBase, ChartProps } from 'src/components/Chart';
import { Chart } from 'src/components/Chart';

import { useViewChartRows } from './hooks';
import { buildReferenceChart, sortByAxisLabel } from './referenceChart';
import { S } from './styles';
import type { ReferenceChartRow, ViewChartProps } from './types';

export type { ViewChartConfig, ViewChartProps, ReferenceChartRow } from './types';
export type { ViewChartDataSource } from './hooks';
export { buildReferenceChart, sortByAxisLabel } from './referenceChart';

export function ViewChart<TRow extends ReferenceChartRow>(props: ViewChartProps<TRow>) {
    const {
        source,
        parameters,
        sort = sortByAxisLabel,
        chart = buildReferenceChart,
        onPointClick,
        renderChart,
    } = props;

    const [rows] = useViewChartRows<TRow>(source, { parameters, sort });

    return (
        <RenderRemoteData
            remoteData={rows}
            renderLoading={() => <S.Loading />}
            renderFailure={(error) => <S.Failure type="error" message={formatError(error)} />}
        >
            {(data) => {
                const config = typeof chart === 'function' ? chart(data) : chart;
                const element = (
                    <Chart<ChartDatumBase>
                        {...({
                            ...config,
                            data: config.transform(data),
                            onPointClick,
                        } as ChartProps<ChartDatumBase>)}
                    />
                );

                return <>{renderChart ? renderChart(element, config, data) : element}</>;
            }}
        </RenderRemoteData>
    );
}
