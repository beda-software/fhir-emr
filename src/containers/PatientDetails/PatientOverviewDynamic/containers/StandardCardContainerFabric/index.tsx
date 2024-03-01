import { FhirResource } from 'fhir/r4b';

import { RenderRemoteData } from '@beda.software/fhir-react';

import { Spinner } from 'src/components/Spinner';
import { StandardCard } from 'src/containers/PatientDetails/PatientOverviewDynamic/components/StandardCard';
import { ContainerProps } from 'src/containers/PatientDetails/PatientOverviewDynamic/containers/Dashboards';
import {
    PrepareFunction,
    useStandardCard,
} from 'src/containers/PatientDetails/PatientOverviewDynamic/containers/StandardCardContainerFabric/hooks';

export function StandardCardContainerFabric<T extends FhirResource>(prepareFunction: PrepareFunction<T>) {
    return function StandardCardContainer({ patient, widgetInfo }: ContainerProps) {
        if (!widgetInfo.query) {
            return <div>Error: no query parameter for the widget.</div>;
        }
        
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const { response } = useStandardCard<T>(patient, widgetInfo.query, prepareFunction);

        return (
            <RenderRemoteData remoteData={response} renderLoading={Spinner}>
                {({ card }) => <StandardCard card={card} />}
            </RenderRemoteData>
        );
    };
}
