import { Space } from 'antd';
import { FhirResource } from 'fhir/r4b';

import { ChartingFooterQuestionnaireAction } from '../../actions';
import { ResourceChartingPageProps, ResourceWithId } from '../types';

interface ResourceChartingFooterProps<R extends ResourceWithId> {
    resource: FhirResource;
    actions: ResourceChartingPageProps<R>['footerActions'];
    reload: () => void;
}

export function ResourceChartingFooter<R extends ResourceWithId>(props: ResourceChartingFooterProps<R>) {
    const { actions, reload, resource } = props;

    if (actions === undefined) {
        return null;
    }

    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            {actions.map((resourceAction, index) => (
                <ChartingFooterQuestionnaireAction
                    key={index}
                    action={resourceAction}
                    reload={reload}
                    defaultLaunchContext={[{ name: resource.resourceType, resource: resource }]}
                />
            ))}
        </Space>
    );
}
