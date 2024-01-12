import { t } from '@lingui/macro';
import {
    AllergyIntolerance,
    Condition,
    Consent,
    Immunization,
    MedicationStatement,
    Observation,
    Patient,
    Provenance,
    Resource,
} from 'fhir/r4b';
import { Link, useLocation } from 'react-router-dom';

import { WithId } from '@beda.software/fhir-react';

import { extractExtension, fromFHIRReference } from 'shared/src/utils/converter';

import { formatHumanDate } from 'src/utils/date';

import { ResourceTable, Option } from './ResourceTable';

export function getOptions(patient: WithId<Patient>): Option[] {
    return [
        {
            value: 'active-medications',
            label: 'Active Medications',
            renderTable: (option: Option) => (
                <ResourceTable<MedicationStatement>
                    key={`resource-table-${option.value}`}
                    resourceType="MedicationStatement"
                    params={{
                        patient: patient.id,
                        _sort: ['-_lastUpdated'],
                        _revinclude: ['Provenance:target'],
                    }}
                    option={option}
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
            label: 'Conditions',
            renderTable: (option: Option) => (
                <ResourceTable<Condition>
                    key={`resource-table-${option.value}`}
                    resourceType="Condition"
                    params={{
                        patient: patient.id,
                        _sort: ['-_recorded-date'],
                        _revinclude: ['Provenance:target'],
                    }}
                    option={option}
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
            label: 'Allergies',
            renderTable: (option: Option) => (
                <ResourceTable<AllergyIntolerance>
                    key={`resource-table-${option.value}`}
                    resourceType="AllergyIntolerance"
                    params={{
                        patient: patient.id,
                        _sort: ['-_date'],
                        _revinclude: ['Provenance:target'],
                    }}
                    option={option}
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
            label: 'Immunization',
            renderTable: (option: Option) => (
                <ResourceTable<Immunization>
                    key={`resource-table-${option.value}`}
                    resourceType="Immunization"
                    params={{
                        patient: patient.id,
                        _sort: ['-_date'],
                        _revinclude: ['Provenance:target'],
                    }}
                    option={option}
                />
            ),
            getTableColumns: (provenanceList: Provenance[] = []) => [
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
            label: 'Consents',
            renderTable: (option: Option) => (
                <ResourceTable<Consent>
                    key={`resource-table-${option.value}`}
                    resourceType="Consent"
                    params={{
                        patient: patient.id,
                        status: 'active',
                        _sort: ['-_lastUpdated'],
                        _revinclude: ['Provenance:target'],
                    }}
                    option={option}
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
            label: 'Observations',
            renderTable: (option: Option) => (
                <ResourceTable<Observation>
                    key={`resource-table-${option.value}`}
                    resourceType="Observation"
                    params={{
                        patient: patient.id,
                        status: 'final',
                        _sort: ['-_lastUpdated'],
                        _revinclude: ['Provenance:target'],
                    }}
                    option={option}
                />
            ),
            getTableColumns: (provenanceList: Provenance[] = []) => [
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
                            return (
                                resource.valueCodeableConcept.text || resource.valueCodeableConcept.coding?.[0]?.display
                            );
                        }

                        return null;
                    },
                },
            ],
        },
    ];
}

export function LinkToEdit(props: { name?: string; resource: Resource; provenanceList: Provenance[] }) {
    const { name, resource, provenanceList } = props;
    const location = useLocation();
    const provenance = provenanceList.find(
        (p) =>
            fromFHIRReference(p.target[0])?.id === resource.id &&
            fromFHIRReference(p.target[0])?.resourceType === resource.resourceType,
    );
    const entity = provenance?.entity?.[0]?.what;
    const qrId = fromFHIRReference(entity)?.id;
    const pathname = location.pathname.split('/').slice(0, 3).join('/');

    if (qrId) {
        return <Link to={`${pathname}/documents/${qrId}`}>{name}</Link>;
    }

    return <>{name}</>;
}
