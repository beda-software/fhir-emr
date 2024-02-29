import { Patient } from 'fhir/r4b';

import { RenderRemoteData } from '@beda.software/fhir-react';

import { Spinner } from 'src/components/Spinner';
import { AppointmentCard } from 'src/containers/PatientDetails/PatientOverviewDynamic/components/AppointmentCard';
import { useAppointmentCard } from 'src/containers/PatientDetails/PatientOverviewDynamic/containers/AppointmentCardContainer/hooks';
import { WidgetInfo } from 'src/contexts/PatientDashboardContext';

interface AppointmentCardContainerProps {
    patient: Patient;
    widgetInfo: WidgetInfo;
}

export function AppointmentCardContainer({ patient, widgetInfo }: AppointmentCardContainerProps) {
    const { response } = useAppointmentCard(patient, widgetInfo.query);

    return (
        <RenderRemoteData remoteData={response} renderLoading={Spinner}>
            {({ appointments }) => {
                return (
                    <div>
                        {appointments.map((appointment, index) => (
                            <AppointmentCard key={index} appointment={appointment} />
                        ))}
                    </div>
                );
            }}
        </RenderRemoteData>
    );
}
