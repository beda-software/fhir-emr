import { Patient } from 'fhir/r4b';

import { parseFHIRDateTime } from '@beda.software/fhir-react';

import { ContainerProps } from 'src/components/Dashboard/types';
import { SummaryCard } from 'src/containers/PatientDetails/PatientOverviewDynamic/components/SummaryCard';
import { useSummaryCard } from 'src/containers/PatientDetails/PatientOverviewDynamic/containers/SummaryCardContainer/hooks';
import { compileAsFirst } from 'src/utils';

const createdAt = compileAsFirst<Patient, string>("Patient.meta.extension('ex:createdAt').valueInstant");

export function SummaryContainer({ patient }: ContainerProps) {
    const { summaryCompositionRD, generateSummary, summaryUpdateState } = useSummaryCard(patient);

    let hideGenerated = true;
    const created = createdAt(patient);
    if (created) {
        hideGenerated = parseFHIRDateTime(created).toDate() < new Date('2025-05-12');
    }

    return (
        <SummaryCard
            hideGenerate={hideGenerated}
            summaryCompositionRD={summaryCompositionRD}
            generateSummary={generateSummary}
            summaryUpdateState={summaryUpdateState}
        />
    );
}
