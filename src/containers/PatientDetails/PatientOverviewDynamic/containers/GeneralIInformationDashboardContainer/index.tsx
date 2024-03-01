import { Patient } from 'fhir/r4b';

import { GeneralInformationDashboard } from 'src/containers/PatientDetails/PatientOverviewDynamic/components/GeneralInformationDashboard';
import { useGeneralInformationDashboard } from 'src/containers/PatientDetails/PatientOverviewDynamic/containers/GeneralIInformationDashboardContainer/hooks';
import { WidgetInfo } from 'src/contexts/PatientDashboardContext';

interface GeneralInformationDashboardContainerProps {
    patient: Patient;
    widgetInfo: WidgetInfo;
}

export function GeneralInformationDashboardContainer({ patient }: GeneralInformationDashboardContainerProps) {
    const { patientDetails } = useGeneralInformationDashboard(patient);

    return <GeneralInformationDashboard patientDetails={patientDetails} patient={patient} />;
}
