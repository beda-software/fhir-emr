import type { Patient } from 'fhir/r4b';
import { useNavigate } from 'react-router-dom';

import type { WithId } from '@beda.software/fhir-react';

import { ChartCard } from 'src/components/Chart';

import { getHMBCharts } from './config';
import { useHMBResponses } from './hooks';
import { S } from './styles';
import type { HMBChartDatum, HMBResponseRow } from './types';

export function HMBDiagnosticDashboard({ patient }: { patient: WithId<Patient> }) {
    const navigate = useNavigate();
    const [responses] = useHMBResponses(patient.id);

    const onPointClick = (datum: HMBChartDatum) => navigate(`/patients/${patient.id}/documents/${datum.qrId}`);

    return (
        <S.Grid>
            {getHMBCharts().map(({ id, ...cfg }) => (
                <ChartCard<HMBResponseRow, HMBChartDatum>
                    key={id}
                    rows={responses}
                    onPointClick={onPointClick}
                    {...cfg}
                />
            ))}
        </S.Grid>
    );
}
