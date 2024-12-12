import { ContainerProps } from 'src/components/Dashboard/types';
import { CreatinineDashboard } from 'src/components/DashboardCard/creatinine';
import { useCreatinineDashboard } from 'src/containers/PatientDetails/PatientOverviewDynamic/containers/CreatinineDashboardContainer/hooks';

function CreatinineDashboardWrapper(props: ContainerProps) {
    const { patient, widgetInfo } = props;

    const searchParams = widgetInfo.query!.search(patient);

    const { creatinineObservations, reloadCreatinineObservations } = useCreatinineDashboard(searchParams);

    return (
        <CreatinineDashboard
            patient={patient}
            observationsRemoteData={creatinineObservations}
            reload={reloadCreatinineObservations}
        />
    );
}

export function CreatinineDashboardContainer(props: ContainerProps) {
    const { widgetInfo } = props;

    if (!widgetInfo.query) {
        return <div>Error: no query parameter for the widget.</div>;
    }

    return <CreatinineDashboardWrapper {...props} />;
}
