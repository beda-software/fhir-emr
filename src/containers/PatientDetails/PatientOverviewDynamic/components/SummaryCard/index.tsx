import { FileOutlined } from '@ant-design/icons';
import { isSuccess, RemoteData } from '@beda.software/remote-data';
import { t } from '@lingui/macro';
import { Button } from 'antd';
import { Composition } from 'fhir/r4b';
import { S } from 'src/containers/PatientDetails/PatientOverviewDynamic/PatientOverview.styles';

import { DashboardCard } from 'src/components/DashboardCard';
import { RenderRemoteData } from '@beda.software/fhir-react';
import { Spinner } from 'src/components';
import { formatHumanDateTime } from 'src/utils';

interface Props {
    summaryCompositionRD: RemoteData<Composition | undefined>;
    generateSummary: () => void;
    summaryIsUpdating: boolean;
}

export function SummaryCard({ summaryCompositionRD, generateSummary, summaryIsUpdating }: Props) {
    return (
        <DashboardCard
            title={t`AI Summary`}
            extra={
                isSuccess(summaryCompositionRD) && summaryCompositionRD.data ? (
                    <>
                        <span>Generated: {formatHumanDateTime(summaryCompositionRD.data?.date)}</span>
                        <Button type="primary" onClick={generateSummary} loading={summaryIsUpdating}>
                            Update
                        </Button>
                    </>
                ) : (
                    <Button type="primary" onClick={generateSummary} loading={summaryIsUpdating}>
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
