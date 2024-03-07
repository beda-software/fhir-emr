import { ContainerProps } from 'src/components/Dashboard/types';
import { GeneralInformationDashboard } from 'src/containers/PatientDetails/PatientOverviewDynamic/components/GeneralInformationDashboard';
import { useGeneralInformationDashboard } from 'src/containers/PatientDetails/PatientOverviewDynamic/containers/GeneralIInformationDashboardContainer/hooks';

export function GeneralInformationDashboardContainer({ patient }: ContainerProps) {
    const { patientDetails } = useGeneralInformationDashboard(patient);

    return <GeneralInformationDashboard patientDetails={patientDetails} patient={patient} />;
}
