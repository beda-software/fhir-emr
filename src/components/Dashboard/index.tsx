import { Patient } from 'fhir/r4b';

import { WidgetInfo } from 'src/components/Dashboard/types';

interface Props {
    patient: Patient;
    widgets: WidgetInfo[];
}

export function Dashboards(props: Props) {
    const { patient, widgets } = props;

    const dashboardComponents = widgets.map((widgetInfo, index) => {
        const WidgetComponent = widgetInfo.widget;

        return <WidgetComponent key={index} patient={patient} widgetInfo={widgetInfo} />;
    });

    return <>{dashboardComponents}</>;
}
