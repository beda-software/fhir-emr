import { ContainerProps } from 'src/components/Dashboard/types';
import { CreatinineDashboard } from 'src/components/DashboardCard/creatinine';

export function CreatinineDashboardContainer({ patient }: ContainerProps) {
    return <CreatinineDashboard patient={patient} />;
}
