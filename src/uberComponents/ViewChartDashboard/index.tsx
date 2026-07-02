import { Fragment } from 'react';

import { formatError, RenderRemoteData } from '@beda.software/fhir-react';

import type { ChartDatumBase, ChartProps } from 'src/components/Chart';
import { Chart } from 'src/components/Chart';
import { useViewDefinitionRows } from 'src/hooks';

import { buildReferenceCharts, sortByAxisLabel } from './referenceCharts';
import { S } from './styles';
import type { ReferenceChartRow, ViewChartDashboardProps } from './types';

export type { ViewChartConfig, ViewChartDashboardProps, ReferenceChartRow } from './types';

export function ViewChartDashboard<TRow extends ReferenceChartRow>(props: ViewChartDashboardProps<TRow>) {
    const {
        viewDefinitionId,
        parameters,
        sort = sortByAxisLabel,
        charts = buildReferenceCharts,
        onPointClick,
        columns,
        gap,
        renderChart,
    } = props;

    const [rows] = useViewDefinitionRows<TRow>(viewDefinitionId, { parameters, sort });

    return (
        <RenderRemoteData
            remoteData={rows}
            renderLoading={() => <S.Loading />}
            renderFailure={(error) => <S.Failure type="error" message={formatError(error)} />}
        >
            {(data) => {
                const list = typeof charts === 'function' ? charts(data) : charts;

                return (
                    <S.Grid $columns={columns} $gap={gap}>
                        {list.map((config, index) => {
                            const chart = (
                                <Chart<ChartDatumBase>
                                    {...({
                                        ...config,
                                        data: config.transform(data),
                                        onPointClick,
                                    } as ChartProps<ChartDatumBase>)}
                                />
                            );

                            return (
                                <Fragment key={index}>
                                    {renderChart ? renderChart(chart, config, index) : chart}
                                </Fragment>
                            );
                        })}
                    </S.Grid>
                );
            }}
        </RenderRemoteData>
    );
}
