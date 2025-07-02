import { Space } from 'antd';

import { ResourceChartingFooterProps } from './types';
import { ChartingFooterQuestionnaireAction } from '../../actions';
import { ResourceWithId } from '../types';

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
