import { ResourceChartingPageProps, ResourceWithId } from '../types';
import { Space } from 'antd';
import { FooterQuestionnaireAction } from '../../actions';
import { FhirResource } from 'fhir/r4b';

interface ResourceChartingFooterProps<R extends ResourceWithId> {
    resource: FhirResource,
    actions: ResourceChartingPageProps<R>['footerActions']
    reload: () => void;
}

export function ResourceChartingFooter<R extends ResourceWithId>(props: ResourceChartingFooterProps<R>) {
    const { actions, reload, resource } = props;

    if (actions === undefined) {
        return null;
    }

    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            {actions.map((resourceAction) => <FooterQuestionnaireAction
                action={resourceAction}
                reload={reload}
                defaultLaunchContext={[
                    { name: resource.resourceType, resource: resource },
                ]}
            />)}
        </Space>
    );
}
