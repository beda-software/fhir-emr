import { Trans } from '@lingui/macro';

import { formatHumanDateTime } from 'src/utils/date';

import { formatModality } from './study';
import { ImagingColumn, ImagingColumnKey, PatientImagingProps } from './types';

export const DEFAULT_IMAGING_COLUMNS: ImagingColumnKey[] = ['started', 'modality', 'series', 'images'];

// The built-in List columns by key, for a page to place, wrap or retitle.
export const IMAGING_COLUMNS: Record<ImagingColumnKey, ImagingColumn> = {
    started: {
        title: <Trans>Date/time</Trans>,
        key: 'started',
        render: (_text, record) => formatHumanDateTime(record.resource.started),
    },
    modality: {
        title: <Trans>Type</Trans>,
        key: 'modality',
        render: (_text, record) => formatModality(record.resource),
    },
    series: {
        title: <Trans>Series</Trans>,
        key: 'series',
        render: (_text, record) => formatCount(record.resource.numberOfSeries),
    },
    images: {
        title: <Trans>Images</Trans>,
        key: 'images',
        render: (_text, record) => formatCount(record.resource.numberOfInstances),
    },
    attachedOn: {
        title: <Trans>Attached on</Trans>,
        key: 'attachedOn',
        render: (_text, record) => formatHumanDateTime(record.resource.meta?.lastUpdated),
    },
};

// Associations made before fhir-imaging stored counts have none.
function formatCount(count: number | undefined) {
    return count ?? '—';
}

export function selectColumns(
    columns: PatientImagingProps['columns'],
    modalities: string[] | undefined,
): NonNullable<PatientImagingProps['columns']> {
    if (columns) {
        return columns;
    }

    return modalities?.length === 1
        ? DEFAULT_IMAGING_COLUMNS.filter((key) => key !== 'modality')
        : DEFAULT_IMAGING_COLUMNS;
}
