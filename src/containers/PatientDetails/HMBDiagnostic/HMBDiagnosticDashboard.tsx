import { Patient } from 'fhir/r4b';
import { useNavigate } from 'react-router-dom';

import { ChartCard } from 'src/components/Chart';
import { QuestionanireModal } from 'src/uberComponents/QuestionnaireModal';

import { getHMBCharts } from './config';
import { useHMBResponses } from './hooks';
import { S } from './styles';
import { HMBChartDatum, HMBResponseRow } from './types';

export function HMBDiagnosticDashboard({ patient }: { patient: Patient }) {
    const navigate = useNavigate();
    const [responses, manager] = useHMBResponses(patient.id);

    const onPointClick = (datum: HMBChartDatum) => navigate(`/patients/${patient.id}/documents/${datum.qrId}`);

    return (
        <>
            <QuestionanireModal
                questionnaire={{
                    reference: 'Questionanire/heavy-menstrual-bleeding-screening',
                    display: 'Heavy Menstrual Bleeding Screening',
                }}
                launchContextParameters={[{ name: 'Patient', resource: patient }]}
                subject={{ reference: `Patient/${patient.id}` }}
                onSuccess={() => manager.reload()}
            />
            <S.Grid>
                {getHMBCharts().map((cfg, index) => (
                    <ChartCard<HMBResponseRow, HMBChartDatum>
                        key={index}
                        rows={responses}
                        onPointClick={onPointClick}
                        {...cfg}
                    />
                ))}
            </S.Grid>
        </>
    );
}
