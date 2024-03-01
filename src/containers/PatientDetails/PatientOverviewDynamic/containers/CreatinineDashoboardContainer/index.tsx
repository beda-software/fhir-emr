import { CreatinineDashoboard } from 'src/components/DashboardCard/creatinine';
import { useCreatinineDashoboard } from 'src/containers/PatientDetails/PatientOverviewDynamic/containers/CreatinineDashoboardContainer/hooks';
import { ContainerProps } from 'src/containers/PatientDetails/PatientOverviewDynamic/containers/Dashboards';

export function CreatinineDashoboardContainer({ patient, widgetInfo }: ContainerProps) {
    if (!widgetInfo.query) {
        return <div>Error: no query parameter for the widget.</div>;
    }
    
    const searchParams = widgetInfo.query.search(patient);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { creatinineObservations, reloadCreatinineObservations } = useCreatinineDashoboard(searchParams);

    return (
        <CreatinineDashoboard
            patient={patient}
            observationsRemoteData={creatinineObservations}
            reload={reloadCreatinineObservations}
        />
    );
}
