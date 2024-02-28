import { Patient } from 'fhir/r4b';

import { CreatinineDashoboardContainer } from 'src/containers/PatientDetails/PatientOverviewDynamic/containers/CreatinineDashoboardContainer';
import { StandardCardContainer } from 'src/containers/PatientDetails/PatientOverviewDynamic/containers/StandardCardContainer';
import { WidgetInfo } from 'src/contexts/PatientDashboardContext';

const widgetComponents = {
    CreatinineDashoboard: CreatinineDashoboardContainer,
    StandardCard: StandardCardContainer,
};

interface Props {
    patient: Patient;
    widgets: WidgetInfo[];
}

export function Dashboards(props: Props) {
    const { patient, widgets } = props;

    const dashboardComponents = widgets.map((widgetInfo, index) => {
        const WidgetComponent = widgetComponents[widgetInfo.widget.displayName];
        if (WidgetComponent) {
            return <WidgetComponent key={index} patient={patient} widgetInfo={widgetInfo} />;
        }
        return null;
    });

    return <div>{dashboardComponents}</div>;
}
