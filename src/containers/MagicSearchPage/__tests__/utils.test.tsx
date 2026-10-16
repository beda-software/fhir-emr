import { render } from '@testing-library/react';
import { Bundle, Observation, Patient } from 'fhir/r4b';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test } from 'vitest';

import { buildMagicSearchColumns, normalizeMagicSearchParams } from '../utils';

const heartRate: Observation = {
    resourceType: 'Observation',
    id: 'hr',
    status: 'final',
    code: { coding: [{ system: 'http://loinc.org', code: '8867-4', display: 'Heart rate' }] },
    effectiveDateTime: '2026-10-01T10:00:00Z',
    valueQuantity: { value: 72, unit: 'beats/minute', system: 'http://unitsofmeasure.org', code: '/min' },
};

const bloodPressure: Observation = {
    resourceType: 'Observation',
    id: 'bp',
    status: 'final',
    code: { text: 'Blood pressure' },
    component: [
        {
            code: { coding: [{ code: '8480-6', display: 'Systolic blood pressure' }] },
            valueQuantity: { value: 120, unit: 'mmHg' },
        },
        {
            code: { coding: [{ code: '8462-4', display: 'Diastolic blood pressure' }] },
            valueQuantity: { value: 80, unit: 'mmHg' },
        },
    ],
};

function renderColumn(fhirPath: string, resource: Observation) {
    const [column] = buildMagicSearchColumns<Observation>([{ title: 'Column', dataIndex: 'column', fhirPath }]);
    const { container } = render(<MemoryRouter>{column!.render(resource)}</MemoryRouter>);

    return container.textContent;
}

describe('Magic search column rendering', () => {
    test.each([
        ['Observation.value', heartRate, '72 beats/minute'],
        ['Observation.code', heartRate, 'Heart rate'],
        ['Observation.code', bloodPressure, 'Blood pressure'],
        ['Observation.component.value', bloodPressure, '120 mmHg, 80 mmHg'],
        [
            'Observation.component',
            bloodPressure,
            'Systolic blood pressure: 120 mmHg, Diastolic blood pressure: 80 mmHg',
        ],
        ['Observation.value', bloodPressure, ''],
        ['Observation.status', heartRate, 'final'],
    ])('%s', (fhirPath, resource, expected) => {
        expect(renderColumn(fhirPath, resource)).toBe(expected);
    });

    test('never renders [object Object]', () => {
        for (const fhirPath of [
            'Observation',
            'Observation.meta',
            'Observation.code.coding',
            'Observation.component.code',
        ]) {
            expect(renderColumn(fhirPath, bloodPressure)).not.toContain('[object Object]');
        }
    });
});

describe('Magic search patient links', () => {
    function renderLink(fhirPath: string, resource: Patient | Observation) {
        const [column] = buildMagicSearchColumns<Patient | Observation>([
            { title: 'Column', dataIndex: 'column', fhirPath },
        ]);
        const { container } = render(<MemoryRouter>{column!.render(resource)}</MemoryRouter>);

        return container.querySelector('a');
    }

    const patient: Patient = {
        resourceType: 'Patient',
        id: 'p1',
        name: [{ given: ['John'], family: 'Smith' }],
        birthDate: '1980-01-01',
    };

    test('patient name links to AI chart', () => {
        const link = renderLink('Patient.name', patient);
        expect(link?.getAttribute('href')).toBe('/ai-chart/p1');
        expect(link?.textContent).toBe('John Smith');
    });

    test('other patient columns are not links', () => {
        expect(renderLink('Patient.birthDate', patient)).toBeNull();
    });

    test('patient reference without display shows the included patient name', () => {
        const observation: Observation = { ...heartRate, subject: { reference: 'Patient/p1' } };
        const bundle: Bundle = {
            resourceType: 'Bundle',
            type: 'searchset',
            entry: [{ resource: observation }, { resource: patient, search: { mode: 'include' } }],
        };
        const [column] = buildMagicSearchColumns<Observation>([
            { title: 'Patient', dataIndex: 'patient', fhirPath: 'Observation.subject' },
        ]);
        const { container } = render(<MemoryRouter>{column!.render(observation, bundle)}</MemoryRouter>);
        const link = container.querySelector('a');

        expect(link?.getAttribute('href')).toBe('/ai-chart/p1');
        expect(link?.textContent).toBe('John Smith');
    });

    test('patient name column resolves included patient via %Bundle', () => {
        const observation: Observation = { ...heartRate, subject: { reference: 'Patient/p1' } };
        const bundle: Bundle = {
            resourceType: 'Bundle',
            type: 'searchset',
            entry: [{ resource: observation }, { resource: patient, search: { mode: 'include' } }],
        };
        const [column] = buildMagicSearchColumns<Observation>([
            {
                title: 'Patient',
                dataIndex: 'patient',
                fhirPath:
                    "%Bundle.entry.resource.where(resourceType = 'Patient' and ('Patient/' + id) = %context.subject.reference).name.first()",
            },
        ]);
        const { container } = render(<MemoryRouter>{column!.render(observation, bundle)}</MemoryRouter>);

        expect(container.textContent).toBe('John Smith');
    });

    test('patient resource taken via %Bundle links to AI chart', () => {
        const observation: Observation = { ...heartRate, subject: { reference: 'Patient/p1' } };
        const bundle: Bundle = {
            resourceType: 'Bundle',
            type: 'searchset',
            entry: [{ resource: observation }, { resource: patient, search: { mode: 'include' } }],
        };
        const [column] = buildMagicSearchColumns<Observation>([
            {
                title: 'Patient',
                dataIndex: 'patient',
                fhirPath:
                    "%Bundle.entry.resource.where(resourceType = 'Patient' and ('Patient/' + id) = %context.subject.reference)",
            },
        ]);
        const { container } = render(<MemoryRouter>{column!.render(observation, bundle)}</MemoryRouter>);
        const link = container.querySelector('a');

        expect(link?.getAttribute('href')).toBe('/ai-chart/p1');
        expect(link?.textContent).toBe('John Smith');
    });

    test('%Bundle is defined when no bundle is passed', () => {
        const [column] = buildMagicSearchColumns<Observation>([
            { title: 'Count', dataIndex: 'count', fhirPath: '%Bundle.entry.count()' },
        ]);
        const { container } = render(<MemoryRouter>{column!.render(heartRate)}</MemoryRouter>);

        expect(container.textContent).toBe('0');
    });

    test('runtime expression errors are shown in the cell', () => {
        const [column] = buildMagicSearchColumns<Observation>([
            { title: 'Broken', dataIndex: 'broken', fhirPath: '%unknownVariable.name' },
        ]);
        const { container } = render(<MemoryRouter>{column!.render(heartRate)}</MemoryRouter>);

        expect(container.textContent).toBe('Invalid expression');
    });

    test('patient reference falls back to id when the patient is not included', () => {
        const link = renderLink('Observation.subject', { ...heartRate, subject: { reference: 'Patient/p1' } });
        expect(link?.textContent).toBe('p1');
    });

    test('patient reference links to AI chart', () => {
        const link = renderLink('Observation.subject', {
            ...heartRate,
            subject: { reference: 'Patient/p1', display: 'John Smith' },
        });
        expect(link?.getAttribute('href')).toBe('/ai-chart/p1');
        expect(link?.textContent).toBe('John Smith');
    });
});

describe('normalizeMagicSearchParams', () => {
    test.each([
        ['Condition:subject', 'Condition:subject:Patient'],
        ['Condition:patient', 'Condition:patient:Patient'],
        ['Condition:subject:Patient', 'Condition:subject:Patient'],
        ['Encounter:participant', 'Encounter:participant'],
    ])('%s', (include, expected) => {
        expect(normalizeMagicSearchParams({ code: 'x', _include: include })).toEqual({ code: 'x', _include: expected });
    });

    test('array of includes', () => {
        expect(normalizeMagicSearchParams({ _include: ['Condition:subject', 'Condition:encounter'] })).toEqual({
            _include: ['Condition:subject:Patient', 'Condition:encounter'],
        });
    });

    test('no include', () => {
        expect(normalizeMagicSearchParams({ code: 'x' })).toEqual({ code: 'x' });
    });
});
