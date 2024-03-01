import { FhirResource } from 'fhir/r4b';

import { RenderRemoteData } from '@beda.software/fhir-react';

import { ContainerProps } from 'src/components/Dashboard/types';
import { Spinner } from 'src/components/Spinner';
import { StandardCard } from 'src/containers/PatientDetails/PatientOverviewDynamic/components/StandardCard';
import { OverviewCard } from 'src/containers/PatientDetails/PatientOverviewDynamic/components/StandardCard/types';
import {
    PrepareFunction,
    useStandardCard,
} from 'src/containers/PatientDetails/PatientOverviewDynamic/containers/StandardCardContainerFabric/hooks';

export function StandardCardContainerFabric(prepareFunction: PrepareFunction) {
    return function StandardCardContainer({ patient, widgetInfo }: ContainerProps) {
        if (!widgetInfo.query) {
            return <div>Error: no query parameter for the widget.</div>;
        }

        // eslint-disable-next-line react-hooks/rules-of-hooks
        const { response } = useStandardCard(patient, widgetInfo.query, prepareFunction);

        return (
            <RenderRemoteData remoteData={response} renderLoading={Spinner}>
                {({ card }) => <StandardCard card={card as OverviewCard<FhirResource>} />}
            </RenderRemoteData>
        );
    };
}
