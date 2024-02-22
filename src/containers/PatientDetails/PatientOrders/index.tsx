import { t } from '@lingui/macro';
import { Observation, Patient, Provenance } from 'fhir/r4b';

import { WithId } from '@beda.software/fhir-react';

import { extractExtension } from 'shared/src/utils/converter';

import { ResourceTable, LinkToEdit } from 'src/components/ResourceTable';
import { formatHumanDate } from 'src/utils/date';

interface Props {
    patient: WithId<Patient>;
}

function getTableColumns(provenanceList: Array<Provenance> = []) {
    return [
        {
            title: t`Title`,
            key: 'title',
            render: (resource: Observation) => (
                <LinkToEdit
                    name={resource.code?.coding?.[0]?.display}
                    resource={resource}
                    provenanceList={provenanceList}
                />
            ),
            width: 200,
        },
        {
            title: t`Date`,
            key: 'date',
            render: (r: Observation) => {
                const createdAt = extractExtension(r.meta?.extension, 'ex:createdAt');
                const date = r.issued || createdAt;

                return date ? formatHumanDate(date) : null;
            },
            width: 200,
        },
        {
            title: t`Value`,
            key: 'value',
            render: (resource: Observation) => {
                if (resource.valueQuantity) {
                    return `${resource.valueQuantity.value} ${resource.valueQuantity.unit}`;
                } else if (resource.component) {
                    return (
                        <>
                            {resource.component
                                .map((c) =>
                                    [
                                        ...[c.code.coding?.[0]?.display],
                                        ...[`${c.valueQuantity?.value} ${c.valueQuantity?.unit}`],
                                    ].join(': '),
                                )
                                .map((v) => (
                                    <div key={v}>{v}</div>
                                ))}
                        </>
                    );
                } else if (resource.valueCodeableConcept) {
                    return resource.valueCodeableConcept.text || resource.valueCodeableConcept.coding?.[0]?.display;
                }

                return null;
            },
        },
    ];
}

export function PatientOrders({ patient }: Props) {
    return (
        <ResourceTable<Observation>
            resourceType="Observation"
            params={{
                patient: patient.id,
                category: 'laboratory',
                status: 'final',
                _sort: ['-_lastUpdated'],
                _revinclude: ['Provenance:target'],
            }}
            getTableColumns={getTableColumns}
        />
    );
}
