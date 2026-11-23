import { ImagingStudy, Patient } from 'fhir/r4b';
import { describe, expect, it } from 'vitest';

import {
    canAttachStudy,
    canDetachStudy,
    formatAttachTitle,
    formatModality,
    hasBirthDateMismatch,
    isManagedBy,
    readAccessionNumber,
    readStudyInstanceUid,
} from './study';
import { RemoteImagingStudy } from './types';

const DCM = 'http://dicom.nema.org/resources/ontology/DCM';
const UID = '1.2.826.0.1.3680043.8.498.1';

const study = (fields: Partial<ImagingStudy>): ImagingStudy => ({
    resourceType: 'ImagingStudy',
    status: 'available',
    subject: { reference: 'Patient/p1' },
    ...fields,
});
const patient = (fields: Partial<Patient>): Patient => ({ resourceType: 'Patient', id: 'p1', ...fields });
const deviceStudy = (birthDate?: string) =>
    study({ contained: [{ resourceType: 'Patient', name: [{ text: 'DEVTEST^ALICE' }], birthDate }] });

describe('readStudyInstanceUid', () => {
    it('reads the urn:dicom:uid identifier, with or without urn:oid:', () => {
        expect(
            readStudyInstanceUid(study({ identifier: [{ system: 'urn:dicom:uid', value: `urn:oid:${UID}` }] })),
        ).toBe(UID);
        expect(readStudyInstanceUid(study({ identifier: [{ system: 'urn:dicom:uid', value: UID }] }))).toBe(UID);
        expect(readStudyInstanceUid(study({ identifier: [{ system: 'other', value: UID }] }))).toBeUndefined();
    });
});

describe('readAccessionNumber', () => {
    it('reads the ACSN-typed identifier only', () => {
        expect(readAccessionNumber(study({ identifier: [{ system: 'urn:dicom:uid', value: 'urn:oid:1.2' }] }))).toBe(
            undefined,
        );
        expect(readAccessionNumber(undefined)).toBe(undefined);
    });
});

describe('isManagedBy', () => {
    const marker = { system: 'urn:fhir-imaging/managed-by', code: 'measure' };

    it("matches only this installation's marker", () => {
        expect(isManagedBy(study({ meta: { tag: [marker] } }), marker)).toBe(true);
        expect(isManagedBy(study({ meta: { tag: [{ ...marker, code: 'other' }] } }), marker)).toBe(false);
        expect(isManagedBy(study({}), marker)).toBe(false);
    });
});

describe('formatModality', () => {
    it('names known DICOM modalities once each, else shows display or code', () => {
        expect(
            formatModality(
                study({
                    modality: [
                        { system: DCM, code: 'US' },
                        { system: DCM, code: 'MR', display: 'Magnetic Resonance' },
                        { system: DCM, code: 'CR' },
                        { system: DCM, code: 'DX' },
                        { system: DCM, code: 'ES' },
                        { system: DCM, code: 'SR', display: 'Structured Report' },
                        { system: DCM, code: 'IVUS' },
                    ],
                }),
            ),
        ).toBe('Ultrasound, MRI, X-ray, Endoscopy, Structured Report, IVUS');
        expect(formatModality(study({}))).toBeUndefined();
    });
});

describe('formatAttachTitle', () => {
    it("adds the Patient's name and date of birth, dropping missing parts", () => {
        const name = [{ given: ['First'], family: 'Patient' }];
        expect(formatAttachTitle('Attach', patient({ name, birthDate: '1980-04-12' }))).toBe(
            'Attach — First Patient, 12 Apr 1980',
        );
        expect(formatAttachTitle('Attach', patient({ name }))).toBe('Attach — First Patient');
    });

    it('falls back to the id when the Patient has no name or date of birth, e.g. a pseudonymised one', () => {
        expect(formatAttachTitle('Attach', patient({}))).toBe('Attach — ID p1');
    });
});

describe('hasBirthDateMismatch', () => {
    it('flags differing dates of birth only when both are known', () => {
        expect(hasBirthDateMismatch(patient({ birthDate: '1980-04-12' }), deviceStudy('1972-11-03'))).toBe(true);
        expect(hasBirthDateMismatch(patient({ birthDate: '1980-04-12' }), deviceStudy('1980-04-12'))).toBe(false);
        expect(hasBirthDateMismatch(patient({ birthDate: '1980-04-12' }), deviceStudy())).toBe(false);
        expect(hasBirthDateMismatch(patient({}), deviceStudy('1972-11-03'))).toBe(false);
    });
});

describe('attaching', () => {
    const remote: RemoteImagingStudy = {
        resourceType: 'ImagingStudy',
        status: 'available',
        subject: { reference: '#patient' },
        identifier: [{ system: 'urn:dicom:uid', value: 'urn:oid:1.2' }],
    };

    it('allows another Patient only when the Host supports multiple Patients per study', () => {
        expect(canAttachStudy(remote, undefined)).toBe(true);
        expect(canAttachStudy(remote, 'other-patient')).toBe(false);
        expect(canAttachStudy(remote, 'this-patient')).toBe(false);
        expect(canAttachStudy({ ...remote, identifier: [] }, undefined)).toBe(false);
    });

    it('requires a stored id, version and ownership marker to detach', () => {
        const marker = { system: 'urn:fhir-imaging/managed-by', code: 'measure' };
        const stored = study({ id: 's1', meta: { tag: [marker], versionId: '7' } });
        expect(canDetachStudy(stored, marker)).toBe(true);
        expect(canDetachStudy({ ...stored, meta: { tag: [marker] } }, marker)).toBe(false);
        expect(canDetachStudy({ ...stored, id: undefined }, marker)).toBe(false);
        expect(canDetachStudy({ ...stored, meta: { versionId: '7' } }, marker)).toBe(false);
    });
});
