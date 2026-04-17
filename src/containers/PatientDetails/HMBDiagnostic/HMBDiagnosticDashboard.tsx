import { Patient } from 'fhir/r4b';
import { useNavigate } from 'react-router-dom';
import { useTheme } from 'styled-components';

import { ChartCard } from 'src/components/Chart';

import { getHMBCharts } from './config';
import { useHMBResponses } from './hooks';
import { S } from './styles';
import { HMBChartDatum, HMBResponseRow } from './types';

export function HMBDiagnosticDashboard({ patient }: { patient: Patient }) {
    const navigate = useNavigate();
    const theme = useTheme();
    const [responses] = useHMBResponses(patient.id);

    const onPointClick = (datum: HMBChartDatum) => navigate(`/patients/${patient.id}/documents/${datum.qrId}`);

    return (
        <S.Grid>
            {getHMBCharts(theme).map((cfg, index) => (
                <ChartCard<HMBResponseRow, HMBChartDatum>
                    key={index}
                    rows={responses}
                    onPointClick={onPointClick}
                    {...cfg}
                />
            ))}
        </S.Grid>
    );
}
