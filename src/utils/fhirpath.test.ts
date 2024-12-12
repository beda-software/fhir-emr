import { Location } from 'fhir/r4b';

import { evaluate } from './fhirpath';

const location: Location = {
    resourceType: 'Location',
    name: 'South Wing Neuro OR 1',
    type: [
        {
            coding: [
                {
                    system: 'http://terminology.hl7.org/CodeSystem/v3-RoleCode',
                    code: 'RNEU',
                    display: 'Neuroradiology unit',
                },
            ],
        },
    ],
    physicalType: {
        coding: [
            {
                system: 'http://terminology.hl7.org/CodeSystem/location-physical-type',
                code: 'ro',
                display: 'Room',
            },
        ],
    },
};

const tSystem = 'http://terminology.hl7.org/CodeSystem/v3-RoleCode';
const ptSystem = 'http://terminology.hl7.org/CodeSystem/location-physical-type';

const locations = [location];

describe('Location filtering', () => {
    test('optional chain get', () => {
        const physycalType = location.physicalType?.coding?.find(({ system }) => system === ptSystem)?.display;
        expect(physycalType).toBe('Room');
    });

    test('fhirpath get', () => {
        const physycalType = evaluate(
            location,
            `Location.physicalType.coding.where(system='${ptSystem}').display`,
        )?.[0];
        expect(physycalType).toBe('Room');
    });

    test('optional chain search', () => {
        const l = locations.filter(
            (l) => l.physicalType?.coding?.find(({ system }) => system === ptSystem)?.code == 'ro',
        );
        expect(l?.length).toBe(1);
    });

    test('fhirpath search', () => {
        const l = evaluate(locations, "Location.where(physicalType.coding.code contains 'ro')");
        expect(l?.length).toBe(1);
    });

    test('optional chain search then get', () => {
        const l = locations
            .filter((l) => l.physicalType?.coding?.find(({ system }) => system === ptSystem)?.code == 'ro')
            .map(
                (l) =>
                    l.type
                        ?.find((t) => t.coding?.find(({ system }) => system === tSystem))
                        ?.coding?.find(({ system }) => system === tSystem)?.display,
            )?.[0];
        expect(l).toBe('Neuroradiology unit');
    });

    test('fhirpath search then get', () => {
        const l = evaluate(
            locations,
            `Location.where(physicalType.coding.code contains 'ro').type.coding.where(system='${tSystem}').display`,
        )?.[0];
        expect(l).toBe('Neuroradiology unit');
    });

    test('optional chain search by type', () => {
        const l = locations.filter(
            (l) =>
                l.type?.find((t) => t.coding?.find(({ system }) => system === tSystem)?.code === 'RNEU') !== undefined,
        );
        expect(l?.length).toBe(1);
    });

    test('fhirpath search by type', () => {
        const l = evaluate(locations, `Location.where(type.coding.where(system='${tSystem}').code = 'RNEU')`);
        expect(l?.length).toBe(1);
    });
});
