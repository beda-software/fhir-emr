import { Resource } from 'fhir/r4b';

import { RenderRemoteData } from '@beda.software/fhir-react';

import { ContainerProps } from 'src/components/Dashboard/types';
import { Spinner } from 'src/components/Spinner';
import { StandardCard } from 'src/containers/PatientDetails/PatientOverviewDynamic/components/StandardCard';
import {
    OverviewCard,
    PrepareFunction,
} from 'src/containers/PatientDetails/PatientOverviewDynamic/components/StandardCard/types';
import { useStandardCard } from 'src/containers/PatientDetails/PatientOverviewDynamic/containers/StandardCardContainerFabric/hooks';

interface StandardCardContainerWrapperProps<T extends Resource> extends ContainerProps {
    prepareFunction: PrepareFunction<T>;
}

function StandardCardContainerWrapper<T extends Resource>(props: StandardCardContainerWrapperProps<T>) {
    const { patient, widgetInfo, prepareFunction } = props;

    const { response } = useStandardCard(patient, widgetInfo.query!, prepareFunction);

    return (
        <RenderRemoteData remoteData={response} renderLoading={Spinner}>
            {({ card }) => <StandardCard card={card as OverviewCard<T>} />}
        </RenderRemoteData>
    );
}

export function StandardCardContainerFabric<T extends Resource>(prepareFunction: PrepareFunction<T>) {
    return function StandardCardContainer(props: ContainerProps) {
        const { widgetInfo } = props;

        if (!widgetInfo.query) {
            return <div>Error: no query parameter for the widget.</div>;
        }

        return <StandardCardContainerWrapper<T> {...props} prepareFunction={prepareFunction} />;
    };
}
