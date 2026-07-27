import { Alert, Spin } from 'antd';

import { formatError, RenderRemoteData } from '@beda.software/fhir-react';

import { Chart, ChartDatumBase, ChartProps } from 'src/components/Chart';
import { useViewChartRows, ViewChartDataSource, ViewDefinitionRunParameter } from 'src/uberComponents/ViewChart';

import { buildQIMChart, noSort } from './chart';
import { QIMRow } from './types';

export function QIMChart(props: { source: ViewChartDataSource; parameters: ViewDefinitionRunParameter[] }) {
    const { source, parameters } = props;
    const [rows] = useViewChartRows<QIMRow>(source, { parameters, sort: noSort });

    return (
        <RenderRemoteData
            remoteData={rows}
            renderLoading={() => <Spin style={{ display: 'block', padding: 24 }} />}
            renderFailure={(error) => <Alert style={{ margin: 24 }} type="error" message={formatError(error)} />}
        >
            {(data) => {
                const config = buildQIMChart(data);
                return (
                    <Chart<ChartDatumBase>
                        {...({ ...config, data: config.transform(data) } as ChartProps<ChartDatumBase>)}
                    />
                );
            }}
        </RenderRemoteData>
    );
}
