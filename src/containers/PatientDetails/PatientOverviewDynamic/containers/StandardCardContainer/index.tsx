import { Patient } from 'fhir/r4b';

import { WidgetInfo } from 'src/contexts/PatientDashboardContext';

import { useStandardCard } from './hooks';

interface StandardCardContainerProps {
    patient: Patient;
    widgetInfo: WidgetInfo;
}

export function StandardCardContainer({ patient, widgetInfo }: StandardCardContainerProps) {
    const searchParams = widgetInfo.query.search;
    useStandardCard(patient, searchParams);

    return <div style={{ color: '#ff0000' }}>{JSON.stringify(searchParams)}</div>;
}
