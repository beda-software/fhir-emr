import { FileOutlined } from '@ant-design/icons';
import { t } from '@lingui/macro';
import { Button, notification } from 'antd';
import { Composition } from 'fhir/r4b';

import { formatError, RenderRemoteData } from '@beda.software/fhir-react';
import { isFailure, isLoading, isSuccess, RemoteDataResult, RemoteData } from '@beda.software/remote-data';

import { Spinner } from 'src/components';
import { DashboardCard } from 'src/components/DashboardCard';
import { S } from 'src/containers/PatientDetails/PatientOverviewDynamic/PatientOverview.styles';
import { formatHumanDateTime } from 'src/utils';

interface Props {
    summaryCompositionRD: RemoteData<Composition | undefined>;
    generateSummary: () => Promise<RemoteDataResult<unknown>>;
    summaryUpdateState: RemoteData;
}

export function SummaryCard({ summaryCompositionRD, generateSummary, summaryUpdateState }: Props) {
    async function handleSummaryUpdate() {
        const response = await generateSummary();
        if (isFailure(response)) {
            notification.error({ message: formatError(response.error) });
        }
    }

    return (
        <DashboardCard
            title={t`AI Summary`}
            extra={
                isSuccess(summaryCompositionRD) && summaryCompositionRD.data ? (
                    <>
                        <span>Generated: {formatHumanDateTime(summaryCompositionRD.data?.date)}</span>
                        <Button type="primary" onClick={handleSummaryUpdate} loading={isLoading(summaryUpdateState)}>
                            Update
                        </Button>
                    </>
                ) : (
                    <Button type="primary" onClick={handleSummaryUpdate} loading={isLoading(summaryUpdateState)}>
                        Generate new summary
                    </Button>
                )
            }
            icon={<FileOutlined />}
        >
            <S.DetailsRow>
                <RenderRemoteData remoteData={summaryCompositionRD} renderLoading={Spinner}>
                    {(resource) => <div>{resource ? resource.section?.[0]?.text?.div : 'No summary'}</div>}
                </RenderRemoteData>
            </S.DetailsRow>
        </DashboardCard>
    );
}
