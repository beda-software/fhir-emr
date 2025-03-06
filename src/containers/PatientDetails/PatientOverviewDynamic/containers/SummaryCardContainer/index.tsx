import { ContainerProps } from 'src/components/Dashboard/types';
import { SummaryCard } from 'src/containers/PatientDetails/PatientOverviewDynamic/components/SummaryCard';
import { useSummaryCard } from 'src/containers/PatientDetails/PatientOverviewDynamic/containers/SummaryCardContainer/hooks.ts';

export function SummaryContainer({ patient }: ContainerProps) {
    const { summaryCompositionRD, generateSummary, summaryIsUpdating } = useSummaryCard(patient);

    return (
        <SummaryCard
            summaryCompositionRD={summaryCompositionRD}
            generateSummary={generateSummary}
            summaryIsUpdating={summaryIsUpdating}
        />
    );
}
