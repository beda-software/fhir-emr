import { ImagingStudy } from 'fhir/r4b';
import { describe, expect, it } from 'vitest';

import { buildDeviceFields, buildStudyFields } from './studyFields';

const DCM = 'http://dicom.nema.org/resources/ontology/DCM';
const UID = '1.2.826.0.1.3680043.8.498.1';

const study = (fields: Partial<ImagingStudy>): ImagingStudy => ({
    resourceType: 'ImagingStudy',
    status: 'available',
    subject: { reference: 'Patient/p1' },
    ...fields,
});

describe('buildStudyFields', () => {
    const association = study({
        identifier: [{ system: 'urn:dicom:uid', value: `urn:oid:${UID}` }],
        meta: { lastUpdated: '2026-11-15T10:00:00Z' },
        modality: [{ system: DCM, code: 'US' }],
        numberOfSeries: 1,
        numberOfInstances: 3,
    });
    const current = study({
        identifier: [
            { system: 'urn:dicom:uid', value: `urn:oid:${UID}` },
            {
                type: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/v2-0203', code: 'ACSN' }] },
                value: 'A42',
            },
        ],
        description: 'OB 1st trimester',
        modality: [{ system: DCM, code: 'US' }],
        numberOfSeries: 2,
        numberOfInstances: 5,
    });
    const valuesByKey = (fields: ReturnType<typeof buildStudyFields>) =>
        Object.fromEntries(fields.map(({ key, value }) => [key, value]));

    it('shows the stored fields only, in order, without empty ones', () => {
        const fields = buildStudyFields(association);

        expect(fields.map(({ key }) => key)).toEqual([
            'modality',
            'series',
            'images',
            'attachedOn',
            'studyInstanceUid',
        ]);
        expect(valuesByKey(fields)).toMatchObject({ series: '1', images: '3', studyInstanceUid: UID });
        expect(fields.find(({ key }) => key === 'studyInstanceUid')?.copyable).toBe(true);
    });

    it("puts the Imaging Server's current values over the stored ones", () => {
        const fields = buildStudyFields(association, current);

        expect(fields.map(({ key }) => key)).toEqual([
            'description',
            'modality',
            'series',
            'images',
            'accessionNumber',
            'attachedOn',
            'studyInstanceUid',
        ]);
        expect(valuesByKey(fields)).toMatchObject({
            description: 'OB 1st trimester',
            series: '2',
            images: '5',
            accessionNumber: 'A42',
        });
    });

    it('keeps a zero count', () => {
        expect(valuesByKey(buildStudyFields(study({ numberOfInstances: 0 }))).images).toBe('0');
    });
});

describe('buildDeviceFields', () => {
    it("shows the device's Patient and the referring physician", () => {
        const current = study({
            contained: [
                {
                    resourceType: 'Patient',
                    id: 'patient',
                    identifier: [{ value: 'DEV-1' }],
                    name: [{ family: 'DEVTEST', given: ['ALICE'] }],
                },
            ],
            referrer: { display: 'DR JOHN SMITH' },
        });

        expect(buildDeviceFields(current).map(({ key, value }) => [key, value])).toEqual([
            ['patientId', 'DEV-1'],
            ['name', 'ALICE DEVTEST'],
            ['referrer', 'DR JOHN SMITH'],
        ]);
    });

    it('is empty when the device recorded nothing', () => {
        expect(buildDeviceFields(study({}))).toEqual([]);
    });
});
