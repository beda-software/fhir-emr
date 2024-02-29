import { Patient } from 'fhir/r4b';

import { CreatinineDashoboard } from 'src/components/DashboardCard/creatinine';
import { useCreatinineDashoboard } from 'src/containers/PatientDetails/PatientOverviewDynamic/containers/CreatinineDashoboardContainer/hooks';
import { WidgetInfo } from 'src/contexts/PatientDashboardContext';

interface CreatinineDashoboardContainerProps {
    patient: Patient;
    widgetInfo: WidgetInfo;
}

export function CreatinineDashoboardContainer({ patient, widgetInfo }: CreatinineDashoboardContainerProps) {
    const searchParams = widgetInfo.query.search(patient);
    const { creatinineObservations, reloadCreatinineObservations } = useCreatinineDashoboard(searchParams);

    return (
        <CreatinineDashoboard
            patient={patient}
            observationsRemoteData={creatinineObservations}
            reload={reloadCreatinineObservations}
        />
    );
}
