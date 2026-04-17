import { Alert, Spin } from 'antd';

import { formatError, RenderRemoteData } from '@beda.software/fhir-react';

import { DashboardCard } from 'src/components/DashboardCard';

import { Chart } from './Chart';
import { ChartCardProps, ChartDatumBase } from './Chart.types';
import { S } from './ChartCard.styles';

export function ChartCard<TRow, TDatum extends ChartDatumBase = ChartDatumBase>(props: ChartCardProps<TRow, TDatum>) {
    const { title, icon, iconBackground, iconColor, compactIcon, rows, transform, loading, failure, ...chartProps } =
        props;
    const stateHeight = chartProps.height ?? 260;

    return (
        <DashboardCard
            title={title}
            icon={icon ?? null}
            iconBackground={iconBackground}
            iconColor={iconColor}
            compactIcon={compactIcon}
        >
            <RenderRemoteData
                remoteData={rows}
                renderLoading={() =>
                    loading ? (
                        <>{loading}</>
                    ) : (
                        <S.StateBox $minHeight={stateHeight}>
                            <Spin />
                        </S.StateBox>
                    )
                }
                renderFailure={(error) =>
                    failure ? (
                        <>{failure(error)}</>
                    ) : (
                        <S.StateBox $minHeight={stateHeight}>
                            <Alert type="error" message={formatError(error)} />
                        </S.StateBox>
                    )
                }
            >
                {(data) => <Chart<TDatum> data={transform(data)} {...chartProps} />}
            </RenderRemoteData>
        </DashboardCard>
    );
}
