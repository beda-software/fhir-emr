import { t } from '@lingui/macro';
import { Typography } from 'antd';
import { Bundle, ParametersParameter, Resource } from 'fhir/r4b';
import { useMemo } from 'react';

import { ClinicalContext } from '@beda.software/fhir-questionnaire';
import { RenderRemoteData, WithId } from '@beda.software/fhir-react';

import { DetailPageProps } from 'src/uberComponents/ResourceDetailPage/types';
import { RecordType } from 'src/uberComponents/ResourceListPage/types';
import { getRecordClinicalContextDefault } from 'src/uberComponents/ResourceListPage/utils';

import { useRenderBundleResourceContext } from './hooks';

export type BundleRecordContext<R extends Resource> = RecordType<WithId<R>> & {
    reload: () => void;
};

export interface RenderBundleResourceContextProps<R extends Resource>
    extends Pick<
        DetailPageProps<R>,
        'resourceType' | 'extractPrimaryResource' | 'getClinicalContext' | 'getSearchParams'
    > {
    children: (context: BundleRecordContext<R>) => JSX.Element;
}

export function RenderBundleResourceContext<R extends Resource>(props: RenderBundleResourceContextProps<R>) {
    const { resourceType, extractPrimaryResource, getClinicalContext, children } = props;

    const { response, manager, extractPrimaryResourceDefault } = useRenderBundleResourceContext<R>(props);

    return (
        <RenderRemoteData remoteData={response}>
            {(bundle) => {
                let resource: WithId<R> | undefined = undefined;

                if (extractPrimaryResource) {
                    resource = extractPrimaryResource(bundle);
                } else {
                    resource = extractPrimaryResourceDefault(bundle, { resourceType });
                }

                if (typeof resource === 'undefined') {
                    return (
                        <Typography.Paragraph>{t`Unable to resolve Bundle context for ${resourceType}`}</Typography.Paragraph>
                    );
                }

                const context: BundleRecordContext<R> = {
                    resource,
                    bundle: bundle as Bundle,
                    reload: () => manager.reload(),
                };

                return (
                    <RenderBundleResourceContextContent
                        resourceType={resourceType}
                        context={context}
                        getClinicalContext={getClinicalContext}
                    >
                        {children}
                    </RenderBundleResourceContextContent>
                );
            }}
        </RenderRemoteData>
    );
}

function RenderBundleResourceContextContent<R extends Resource>({
    resourceType,
    context,
    getClinicalContext,
    children,
}: {
    resourceType: R['resourceType'];
    context: BundleRecordContext<R>;
    getClinicalContext?: (context: RecordType<R>) => ParametersParameter[];
    children: (context: BundleRecordContext<R>) => JSX.Element;
}) {
    const clinicalContextParams = useMemo(
        () =>
            getClinicalContext ? getClinicalContext(context) : getRecordClinicalContextDefault(resourceType, context),
        [context, getClinicalContext, resourceType],
    );

    return <ClinicalContext context={clinicalContextParams}>{children(context)}</ClinicalContext>;
}
