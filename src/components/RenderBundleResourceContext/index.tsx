import { Bundle, ParametersParameter, Resource } from 'fhir/r4b';
import { useMemo } from 'react';

import { ClinicalContext } from '@beda.software/fhir-questionnaire';
import { RenderRemoteData, WithId } from '@beda.software/fhir-react';

import { DetailPageProps } from 'src/uberComponents/ResourceDetailPage/types';
import { RecordType } from 'src/uberComponents/ResourceListPage/types';
import { getResourceClinicalContextDefault } from 'src/utils/clinicalContext';

import { useRenderBundleResourceContext } from './hooks';

export type BundleRecordContext<R extends Resource> = RecordType<WithId<R>> & {
    reload: () => void;
};

export interface RenderBundleResourceContextProps<R extends Resource> extends DetailPageProps<R> {
    children: (context: BundleRecordContext<R>) => JSX.Element;
}

export function RenderBundleResourceContext<R extends Resource>(props: RenderBundleResourceContextProps<R>) {
    const { resourceType, extractPrimaryResource, getClinicalContext, children } = props;

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
                    <RenderBundleResourceContextContent context={context} getClinicalContext={getClinicalContext}>
                        {children}
                    </RenderBundleResourceContextContent>
                );
            }}
        </RenderRemoteData>
    );
}

function RenderBundleResourceContextContent<R extends Resource>({
    context,
    getClinicalContext,
    children,
}: {
    context: BundleRecordContext<R>;
    getClinicalContext?: (context: RecordType<R>) => ParametersParameter[];
    children: (context: BundleRecordContext<R>) => JSX.Element;
}) {
    const clinicalContextParams = useMemo(
        () => (getClinicalContext ? getClinicalContext(context) : getResourceClinicalContextDefault(context)),
        [context, getClinicalContext],
    );

    return <ClinicalContext context={clinicalContextParams}>{children(context)}</ClinicalContext>;
}
