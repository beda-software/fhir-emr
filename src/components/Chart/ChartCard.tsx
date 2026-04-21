import { Alert, Spin } from 'antd';

import { formatError, RenderRemoteData } from '@beda.software/fhir-react';

import { DashboardCard } from 'src/components/DashboardCard';

import { Chart } from './Chart';
import { ChartCardProps, ChartDatumBase } from './Chart.types';

export function ChartCard<TRow, TDatum extends ChartDatumBase = ChartDatumBase>(props: ChartCardProps<TRow, TDatum>) {
    const { title, icon, compactIcon = true, rows, transform, ...chartProps } = props;

    return (
        <DashboardCard title={title} icon={icon ?? null} compactIcon={compactIcon}>
            <RenderRemoteData
                remoteData={rows}
                renderLoading={() => <Spin style={{ display: 'block', padding: 24 }} />}
                renderFailure={(error) => <Alert type="error" message={formatError(error)} style={{ margin: 24 }} />}
            >
                {(data) => <Chart<TDatum> data={transform(data)} {...chartProps} />}
            </RenderRemoteData>
        </DashboardCard>
    );
}
