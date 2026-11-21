import { Trans } from '@lingui/macro';
import { Button } from 'antd';
import { ImagingStudy } from 'fhir/r4b';

import { customAction } from 'src/uberComponents/ResourceListPage/actions';
import { ResourceListPageContent } from 'src/uberComponents/ResourceListPageContent';

import { AttachStudy } from './AttachStudy';
import { IMAGING_COLUMNS, selectColumns } from './columns';
import { DetachStudy } from './DetachStudy';
import { useViewStudy } from './hooks';
import { buildListSearchParams } from './list';
import { canDetachStudy, DEFAULT_MANAGED_BY, isStoredImagingStudy } from './study';
import { StudyDetails } from './StudyDetails';
import { PatientImagingProps, StoredImagingStudy } from './types';

export function PatientImaging({
    patient,
    encounter,
    modalities,
    columns,
    dicomSearch = {},
    attachLabel,
    emptyText,
    managedBy = DEFAULT_MANAGED_BY,
    canAttach = true,
    canDetach = true,
}: PatientImagingProps) {
    return (
        <ResourceListPageContent<ImagingStudy>
            resourceType="ImagingStudy"
            searchParams={buildListSearchParams(patient, { encounter, modalities })}
            getTableColumns={() =>
                selectColumns(columns, modalities).map((column) =>
                    typeof column === 'string' ? IMAGING_COLUMNS[column] : column,
                )
            }
            getHeaderActions={({ reload }) =>
                canAttach
                    ? [
                          customAction(
                              <AttachStudy
                                  patient={patient}
                                  encounter={encounter}
                                  modalities={modalities}
                                  dicomSearch={dicomSearch}
                                  managedBy={managedBy}
                                  attachLabel={attachLabel}
                                  onAttached={reload}
                              />,
                          ),
                      ]
                    : []
            }
            getRecordActions={({ resource }, { reload }) =>
                isStoredImagingStudy(resource)
                    ? [
                          customAction(<ViewStudy study={resource} />),
                          customAction(<StudyDetails study={resource} patient={patient} />),
                          ...(canDetach && canDetachStudy(resource, managedBy)
                              ? [
                                    customAction(
                                        <DetachStudy study={resource} managedBy={managedBy} onDetached={reload} />,
                                    ),
                                ]
                              : []),
                      ]
                    : []
            }
            emptyText={emptyText}
        />
    );
}

export interface ViewStudyProps {
    study: StoredImagingStudy;
}

export function ViewStudy({ study }: ViewStudyProps) {
    const view = useViewStudy(study);

    return (
        <Button type="link" size="small" onClick={view}>
            <Trans>View</Trans>
        </Button>
    );
}
