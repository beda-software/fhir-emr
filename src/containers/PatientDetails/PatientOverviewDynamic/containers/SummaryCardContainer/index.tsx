import { ContainerProps } from 'src/components/Dashboard/types';
import { SummaryCard } from 'src/containers/PatientDetails/PatientOverviewDynamic/components/SummaryCard';
import { useSummaryCard } from 'src/containers/PatientDetails/PatientOverviewDynamic/containers/SummaryCardContainer/hooks';

export function SummaryContainer({ patient }: ContainerProps) {
    const { summaryCompositionRD, generateSummary, summaryUpdateState } = useSummaryCard(patient);

    return (
        <SummaryCard
            hideGenerate={patient.id != 'patient1' && patient.id != 'patient2'}
            summaryCompositionRD={summaryCompositionRD}
            generateSummary={generateSummary}
            summaryUpdateState={summaryUpdateState}
        />
    );
}
