import { Patient } from 'fhir/r4b';

import { RenderRemoteData } from '@beda.software/fhir-react';

import { Spinner } from 'src/components/Spinner';
import { WidgetInfo } from 'src/contexts/PatientDashboardContext';

import { useStandardCard } from './hooks';
import { StandardCard } from '../../components/StandardCard';

interface StandardCardContainerProps {
    patient: Patient;
    widgetInfo: WidgetInfo;
}

export function StandardCardContainer({ patient, widgetInfo }: StandardCardContainerProps) {
    const { response } = useStandardCard(patient, widgetInfo.query);

    return (
        <RenderRemoteData remoteData={response} renderLoading={Spinner}>
            {({ card }) => <StandardCard card={card} />}
        </RenderRemoteData>
    );
}
