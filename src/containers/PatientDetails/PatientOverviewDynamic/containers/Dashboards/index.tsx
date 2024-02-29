import { Patient } from 'fhir/r4b';

import { AppointmentCardContainer } from 'src/containers/PatientDetails/PatientOverviewDynamic/containers/AppointmentCardContainer';
import { CreatinineDashoboardContainer } from 'src/containers/PatientDetails/PatientOverviewDynamic/containers/CreatinineDashoboardContainer';
import { GeneralInformationDashboardContainer } from 'src/containers/PatientDetails/PatientOverviewDynamic/containers/GeneralIInformationDashboardContainer';
import { StandardCardContainer } from 'src/containers/PatientDetails/PatientOverviewDynamic/containers/StandardCardContainer';
import { WidgetInfo } from 'src/contexts/PatientDashboardContext';

const widgetComponents = {
    CreatinineDashoboard: CreatinineDashoboardContainer,
    StandardCard: StandardCardContainer,
    AppointmentCard: AppointmentCardContainer,
    GeneralInformationDashboard: GeneralInformationDashboardContainer,
};

interface Props {
    patient: Patient;
    widgets: WidgetInfo[];
    reload: () => void;
}

export function Dashboards(props: Props) {
    const { patient, widgets, reload } = props;

    const dashboardComponents = widgets.map((widgetInfo, index) => {
        const WidgetComponent = widgetComponents[widgetInfo.widget.displayName];
        if (WidgetComponent) {
            return <WidgetComponent key={index} patient={patient} widgetInfo={widgetInfo} reload={reload} />;
        }
        return null;
    });

    return <div>{dashboardComponents}</div>;
}
