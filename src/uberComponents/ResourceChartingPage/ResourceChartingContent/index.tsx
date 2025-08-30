import { Divider } from 'antd';
import { FhirResource } from 'fhir/r4b';

import s from './ResourceChartingContent.module.scss';
import { ResourceChartingContentProps } from './types';
import { ResourceChartingFooter } from '../ResourceChartingFooter';
import { ResourceChartingHeader } from '../ResourceChartingHeader/';
import { ResourceChartingItems } from '../ResourceChartingItems';
import { ResourceWithId } from '../types';

export function ResourceChartingContent<R extends ResourceWithId>(props: ResourceChartingContentProps<R>) {
    const { resource, title, attributes, resourceActions, reload, chartedItems, footerActions } = props;

    return (
        <div className={s.chartingContentContainer}>
            <div>
                <ResourceChartingHeader
                    resource={resource}
                    title={title}
                    preparedAttributes={attributes}
                    resourceActions={resourceActions}
                    reload={reload}
                />
                <Divider className={s.chartingContentDivider} />
                <ResourceChartingItems resource={resource} reload={reload} data={chartedItems} />
            </div>
            <ResourceChartingFooter resource={resource as FhirResource} reload={reload} actions={footerActions} />
        </div>
    );
}
