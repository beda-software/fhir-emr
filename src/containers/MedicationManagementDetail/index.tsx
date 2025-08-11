import { t } from '@lingui/macro';
import { Medication, MedicationKnowledge } from 'fhir/r4b';

import { RenderRemoteData } from '@beda.software/fhir-react';

import { Spinner } from 'src/components/Spinner';
import { ResourceDetailPage, Tab } from 'src/uberComponents/ResourceDetailPage';
import { RecordType } from 'src/uberComponents/ResourceListPage/types';
import { compileAsFirst } from 'src/utils';

import { useMedicationList } from '../MedicationManagement/hooks';
import { MedicationKnowledgeCharacteristics } from '../MedicationManagement/utils';

const getMedicationName = compileAsFirst<MedicationKnowledge, string>(
    'MedicationKnowledge.code.coding.first().display',
);
const getMedicationCode = compileAsFirst<MedicationKnowledge, string>('MedicationKnowledge.code.coding.first().code');

function MedicationKnowledgeOverview({ resource }: { resource: MedicationKnowledge }) {
    const code = getMedicationCode(resource);
    const { medicationResponse } = useMedicationList({ code } as any);

    return (
        <RenderRemoteData remoteData={medicationResponse} renderLoading={Spinner}>
            {(medicationList: Medication[]) => (
                <MedicationKnowledgeCharacteristics
                    medicationKnowledge={resource}
                    medicationList={medicationList ?? []}
                />
            )}
        </RenderRemoteData>
    );
}

export function MedicationManagementDetail() {
    const tabs: Array<Tab<MedicationKnowledge>> = [
        {
            path: '',
            label: t`Overview`,
            component: (context: RecordType<MedicationKnowledge>) => (
                <MedicationKnowledgeOverview resource={context.resource} />
            ),
        },
    ];

    return (
        <ResourceDetailPage<MedicationKnowledge>
            resourceType="MedicationKnowledge"
            getSearchParams={({ id }) => ({ _id: id })}
            getTitle={({ resource, bundle }) => getMedicationName(resource, { bundle }) ?? ''}
            tabs={tabs}
        />
    );
}
