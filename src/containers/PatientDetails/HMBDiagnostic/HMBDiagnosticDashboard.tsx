import { Patient } from 'fhir/r4b';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { ChartDatumBase } from 'src/components/Chart';
import { DashboardCard } from 'src/components/DashboardCard';
import { QuestionanireModal } from 'src/uberComponents/QuestionnaireModal';
import { ReferenceChartRow, ViewChart } from 'src/uberComponents/ViewChart';

import { getHMBCharts } from './config';
import { S } from './styles';
import { HMBChartDatum } from './types';

export function HMBDiagnosticDashboard({ patient }: { patient: Patient }) {
    const navigate = useNavigate();
    const [refreshKey, setRefreshKey] = useState(0);

    const onPointClick = (datum: ChartDatumBase) => {
        const { qrId } = datum as HMBChartDatum;
        navigate(`/patients/${patient.id}/documents/${qrId}`);
    };

    return (
        <>
            <QuestionanireModal
                questionnaire={{
                    reference: 'Questionanire/heavy-menstrual-bleeding-screening',
                    display: 'Heavy Menstrual Bleeding Screening',
                }}
                subject={{ reference: `Patient/${patient.id}` }}
                onSuccess={() => setRefreshKey((key) => key + 1)}
            />
            <S.Grid>
                {getHMBCharts().map((entry) => (
                    <ViewChart<ReferenceChartRow>
                        key={`${entry.id}-${refreshKey}`}
                        source={entry.source}
                        parameters={patient.id ? entry.parameters(patient.id) : []}
                        chart={entry.config}
                        onPointClick={onPointClick}
                        renderChart={(chart, config) => (
                            <DashboardCard title={config.title} icon={entry.icon}>
                                {chart}
                            </DashboardCard>
                        )}
                    />
                ))}
            </S.Grid>
        </>
    );
}
