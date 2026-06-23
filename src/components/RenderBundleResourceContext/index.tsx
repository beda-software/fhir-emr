import { Bundle, ParametersParameter, Resource } from 'fhir/r4b';
import { useMemo } from 'react';

import { ClinicalContext } from '@beda.software/fhir-questionnaire';
import { RenderRemoteData, WithId } from '@beda.software/fhir-react';

import { DetailPageProps } from 'src/uberComponents/ResourceDetailPage/types';
import { RecordType } from 'src/uberComponents/ResourceListPage/types';
import { defaultToClinicalContext } from 'src/utils/clinicalContext';

import { useRenderBundleResourceContext } from './hooks';

export type BundleRecordContext<R extends Resource> = RecordType<WithId<R>> & {
    reload: () => void;
};

export interface RenderBundleResourceContextProps<R extends Resource> extends DetailPageProps<R> {
    children: (context: BundleRecordContext<R>) => JSX.Element;
}

export function RenderBundleResourceContext<R extends Resource>(props: RenderBundleResourceContextProps<R>) {
    const { resourceType, extractPrimaryResource, toClinicalContext, children } = props;

    const { response, manager, defaultExtractPrimaryResource } = useRenderBundleResourceContext<R>(props);

    return (
        <RenderRemoteData remoteData={response}>
            {(bundle) => {
                let resource: WithId<R> | undefined = undefined;

                if (extractPrimaryResource) {
                    resource = extractPrimaryResource(bundle);
                } else {
                    resource = defaultExtractPrimaryResource(bundle, { resourceType });
                }

                if (typeof resource === 'undefined') {
                    return <p>NASTY ERROR</p>;
                }

                const context: BundleRecordContext<R> = {
                    resource,
                    bundle: bundle as Bundle,
                    reload: () => manager.reload(),
                };

                return (
                    <RenderBundleResourceContextContent
                        context={context}
                        resourceType={resourceType}
                        toClinicalContext={toClinicalContext}
                    >
                        {children}
                    </RenderBundleResourceContextContent>
                );
            }}
        </RenderRemoteData>
    );
}

function RenderBundleResourceContextContent<R extends Resource>({
    context,
    resourceType,
    toClinicalContext,
    children,
}: {
    context: BundleRecordContext<R>;
    resourceType: R['resourceType'];
    toClinicalContext?: (bundle: Bundle) => ParametersParameter[];
    children: (context: BundleRecordContext<R>) => JSX.Element;
}) {
    const clinicalContextParams = useMemo(
        () =>
            toClinicalContext
                ? toClinicalContext(context.bundle)
                : defaultToClinicalContext(resourceType, context.bundle),
        [context.bundle, toClinicalContext, resourceType],
    );

    return <ClinicalContext context={clinicalContextParams}>{children(context)}</ClinicalContext>;
}
