import { ContainerProps } from 'src/components/Dashboard/types';
import { CreatinineDashboard } from 'src/components/DashboardCard/creatinine';
import { useCreatinineDashboard } from 'src/containers/PatientDetails/PatientOverviewDynamic/containers/CreatinineDashboardContainer/hooks';

export function CreatinineDashboardContainer({ patient, widgetInfo }: ContainerProps) {
    if (!widgetInfo.query) {
        return <div>Error: no query parameter for the widget.</div>;
    }

    const searchParams = widgetInfo.query.search(patient);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { creatinineObservations, reloadCreatinineObservations } = useCreatinineDashboard(searchParams);

    return (
        <CreatinineDashboard
            patient={patient}
            observationsRemoteData={creatinineObservations}
            reload={reloadCreatinineObservations}
        />
    );
}
