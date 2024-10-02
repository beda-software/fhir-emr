import { RenderRemoteData } from '@beda.software/fhir-react';

import { ContainerProps } from 'src/components/Dashboard/types';
import { Spinner } from 'src/components/Spinner';
import { AppointmentCard } from 'src/containers/PatientDetails/PatientOverviewDynamic/components/AppointmentCard';
import { useAppointmentCard } from 'src/containers/PatientDetails/PatientOverviewDynamic/containers/AppointmentCardContainer/hooks';

function AppointmentCardWrapper(props: ContainerProps) {
    const { patient, widgetInfo } = props;

    const { response } = useAppointmentCard(patient, widgetInfo.query!);

    return (
        <RenderRemoteData remoteData={response} renderLoading={Spinner}>
            {({ appointments }) => {
                return (
                    <>
                        {appointments.map((appointment, index) => (
                            <AppointmentCard key={index} appointment={appointment} />
                        ))}
                    </>
                );
            }}
        </RenderRemoteData>
    );
}

export function AppointmentCardContainer(props: ContainerProps) {
    const { widgetInfo } = props;

    if (!widgetInfo.query) {
        return <div>Error: no query parameter for the widget.</div>;
    }

    return <AppointmentCardWrapper {...props} />;
}
