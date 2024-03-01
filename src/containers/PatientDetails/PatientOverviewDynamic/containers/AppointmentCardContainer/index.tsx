import { RenderRemoteData } from '@beda.software/fhir-react';

import { ContainerProps } from 'src/components/Dashboard/types';
import { Spinner } from 'src/components/Spinner';
import { AppointmentCard } from 'src/containers/PatientDetails/PatientOverviewDynamic/components/AppointmentCard';
import { useAppointmentCard } from 'src/containers/PatientDetails/PatientOverviewDynamic/containers/AppointmentCardContainer/hooks';

export function AppointmentCardContainer({ patient, widgetInfo }: ContainerProps) {
    if (!widgetInfo.query) {
        return <div>Error: no query parameter for the widget.</div>;
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
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
