import { t } from '@lingui/macro';
import {
    AllergyIntolerance,
    Condition,
    ServiceRequest,
    Consent,
    Immunization,
    MedicationStatement,
    Observation,
    Patient,
    Provenance,
    ObservationComponent,
} from 'fhir/r4b';
import { extractExtension } from 'sdc-qrf';

import { WithId } from '@beda.software/fhir-react';

import { LinkToEdit } from 'src/components/LinkToEdit';
import { ResourceTable, Option } from 'src/components/ResourceTable';
import { compileAsArray } from 'src/utils';
import { formatHumanDate, formatHumanDateTime } from 'src/utils/date';

const getInterpretation = compileAsArray<Observation, string>(
    'Observation.interpretation.text | Observation.interpretation.coding.display',
);

function getComponentValue(c: ObservationComponent) {
    if (c.dataAbsentReason) {
        return [c.dataAbsentReason.text ?? 'unknown'];
    }
    return [`${c.valueQuantity?.value} ${c.valueQuantity?.unit}`];
}

export function getOptions(patient: WithId<Patient>): Option[] {
    return [
        {
            value: 'active-medications',
            label: t`Active Medications`,
            renderTable: (option: Option) => (
                <ResourceTable<MedicationStatement>
                    key={`resource-table-${option.value}`}
                    resourceType="MedicationStatement"
                    params={{
                        patient: patient.id,
                        _sort: ['-_lastUpdated', '_id'],
                        _revinclude: ['Provenance:target'],
                    }}
                    getTableColumns={option.getTableColumns}
                />
            ),
            getTableColumns: (provenanceList: Provenance[] = []) => [
                {
                    title: t`Name`,
                    key: 'name',
                    render: (resource: MedicationStatement) => (
                        <LinkToEdit
                            name={resource.medicationCodeableConcept?.coding?.[0]?.display}
                            resource={resource}
                            provenanceList={provenanceList}
                        />
                    ),
                },
                {
                    title: t`Dosage`,
                    key: 'date',
                    render: (r: MedicationStatement) => (r.dosage?.[0]?.text ? r.dosage?.[0]?.text : ''),
                    width: 200,
                },
            ],
        },
        {
            value: 'conditions',
            label: t`Conditions`,
            renderTable: (option: Option) => (
                <ResourceTable<Condition>
                    key={`resource-table-${option.value}`}
                    resourceType="Condition"
                    params={{
                        patient: patient.id,
                        _sort: ['-_recorded-date', '_id'],
                        _revinclude: ['Provenance:target'],
                    }}
                    getTableColumns={option.getTableColumns}
                />
            ),
            getTableColumns: (provenanceList: Provenance[] = []) => [
                {
                    title: t`Name`,
                    key: 'name',
                    render: (resource: Condition) => (
                        <LinkToEdit
                            name={resource.code?.text || resource.code?.coding?.[0]?.display}
                            resource={resource}
                            provenanceList={provenanceList}
                        />
                    ),
                },
                {
                    title: t`Date`,
                    key: 'date',
                    render: (r: Condition) => {
                        const createdAt = extractExtension(r.meta?.extension, 'ex:createdAt');

                        return createdAt ? formatHumanDate(r.recordedDate || createdAt) : null;
                    },
                    width: 200,
                },
            ],
        },
        {
            value: 'allergies',
            label: t`Allergies`,
            renderTable: (option: Option) => (
                <ResourceTable<AllergyIntolerance>
                    key={`resource-table-${option.value}`}
                    resourceType="AllergyIntolerance"
                    params={{
                        patient: patient.id,
                        _sort: ['-date', '_id'],
                        _revinclude: ['Provenance:target'],
                    }}
                    getTableColumns={option.getTableColumns}
                />
            ),
            getTableColumns: (provenanceList: Provenance[] = []) => [
                {
                    title: t`Name`,
                    key: 'name',
                    render: (resource: AllergyIntolerance) => (
                        <LinkToEdit
                            name={resource.code?.coding?.[0]?.display}
                            resource={resource}
                            provenanceList={provenanceList}
                        />
                    ),
                },
                {
                    title: t`Date`,
                    key: 'date',
                    render: (r: AllergyIntolerance) => {
                        const createdAt = extractExtension(r.meta?.extension, 'ex:createdAt');

                        return createdAt ? formatHumanDate(r.recordedDate || createdAt) : null;
                    },
                    width: 200,
                },
            ],
        },
        {
            value: 'immunization',
            label: t`Immunization`,
            renderTable: (option: Option) => (
                <ResourceTable<Immunization>
                    key={`resource-table-${option.value}`}
                    resourceType="Immunization"
                    params={{
                        patient: patient.id,
                        _sort: ['-date', '_id'],
                        _revinclude: ['Provenance:target'],
                    }}
                    getTableColumns={option.getTableColumns}
                />
            ),
            getTableColumns: (provenanceList: Provenance[] = []) => [
                {
                    title: t`Status`,
                    key: 'status',
                    render: ({ status }: Immunization) => status,
                },
                {
                    title: t`Name`,
                    key: 'name',
                    render: (resource: Immunization) => (
                        <LinkToEdit
                            name={resource.vaccineCode.coding?.[0]?.display}
                            resource={resource}
                            provenanceList={provenanceList}
                        />
                    ),
                },
                {
                    title: t`Date`,
                    key: 'date',
                    render: (r: Immunization) => (r.occurrenceDateTime ? formatHumanDate(r.occurrenceDateTime) : ''),
                    width: 200,
                },
            ],
        },
        {
            value: 'consents',
            label: t`Consents`,
            renderTable: (option: Option) => (
                <ResourceTable<Consent>
                    key={`resource-table-${option.value}`}
                    resourceType="Consent"
                    params={{
                        patient: patient.id,
                        status: 'active',
                        _sort: ['-_lastUpdated', '_id'],
                        _revinclude: ['Provenance:target'],
                    }}
                    getTableColumns={option.getTableColumns}
                />
            ),
            getTableColumns: (provenanceList: Provenance[] = []) => [
                {
                    title: t`Name`,
                    key: 'name',
                    render: (resource: Consent) => (
                        <LinkToEdit
                            name={resource.provision?.data?.[0]?.reference.display}
                            resource={resource}
                            provenanceList={provenanceList}
                        />
                    ),
                    width: 200,
                },
                {
                    title: t`Date`,
                    key: 'date',
                    render: (r: Consent) => {
                        const createdAt = extractExtension(r.meta?.extension, 'ex:createdAt');

                        return createdAt ? formatHumanDate(r.dateTime || createdAt) : null;
                    },
                    width: 100,
                },
                {
                    title: t`Practitioner`,
                    key: 'actor',
                    render: (r: Consent) => r.provision?.actor?.[0]?.reference.display,
                    width: 200,
                },
            ],
        },
        {
            value: 'observations',
            label: t`Observations`,
            renderTable: (option: Option) => (
                <ResourceTable<Observation>
                    key={`resource-table-${option.value}`}
                    resourceType="Observation"
                    params={{
                        patient: patient.id,
                        status: 'final',
                        _sort: ['-_lastUpdated', '_id'],
                        _revinclude: ['Provenance:target'],
                    }}
                    getTableColumns={option.getTableColumns}
                />
            ),
            getTableColumns: (provenanceList: Provenance[] = []) => [
                {
                    title: t`Title`,
                    key: 'title',
                    render: (resource: Observation) => (
                        <LinkToEdit
                            name={
                                resource.code?.text ??
                                resource.code?.coding?.[0]?.display ??
                                resource.code?.coding?.[0]?.code
                            }
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
                            const interpretation = getInterpretation(resource).join(', ');
                            return `${resource.valueQuantity.value} ${
                                resource.valueQuantity.unit ?? ''
                            } ${interpretation}`;
                        } else if (resource.valueInteger) {
                            const interpretation = getInterpretation(resource).join(', ');
                            return `${resource.valueInteger} ${interpretation}`;
                        } else if (resource.valueString) {
                            const interpretation = getInterpretation(resource).join(', ');
                            return `${resource.valueString} ${interpretation}`;
                        } else if (resource.component) {
                            return (
                                <>
                                    {resource.component
                                        .map((c) =>
                                            [
                                                ...[c.code.text ?? c.code.coding?.[0]?.display],
                                                ...getComponentValue(c),
                                            ].join(': '),
                                        )
                                        .map((v) => (
                                            <div key={v}>{v}</div>
                                        ))}
                                </>
                            );
                        } else if (resource.valueCodeableConcept) {
                            return (
                                resource.valueCodeableConcept.text || resource.valueCodeableConcept.coding?.[0]?.display
                            );
                        } else if (resource.interpretation) {
                            return getInterpretation(resource).join(', ');
                        }
                        return null;
                    },
                },
            ],
        },
        {
            value: 'serviceRequests',
            label: t`Service Requests`,
            renderTable: (option: Option) => (
                <ResourceTable<ServiceRequest>
                    key={`resource-table-${option.value}`}
                    resourceType="ServiceRequest"
                    params={{
                        patient: patient.id,
                        _sort: ['-_lastUpdated', '_id'],
                    }}
                    getTableColumns={option.getTableColumns}
                />
            ),
            getTableColumns: (provenanceList: Provenance[] = []) => [
                {
                    title: t`Title`,
                    key: 'title',
                    render: (resource: ServiceRequest) => (
                        <LinkToEdit
                            name={resource.code?.coding?.[0]?.display}
                            resource={resource}
                            provenanceList={provenanceList}
                        />
                    ),
                    width: 200,
                },
                {
                    title: t`Date created`,
                    key: 'date',
                    render: (r: Observation) => {
                        const createdAt = extractExtension(r.meta?.extension, 'ex:createdAt');
                        const date = r.issued || createdAt;

                        return date ? formatHumanDateTime(date) : null;
                    },
                    width: 200,
                },
                {
                    title: t`Status`,
                    key: 'name',
                    render: (resource: ServiceRequest) => {
                        return resource.status;
                    },
                },
            ],
        },
    ];
}
