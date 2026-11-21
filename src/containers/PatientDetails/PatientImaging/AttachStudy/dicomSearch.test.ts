import moment from 'moment';
import { describe, expect, it } from 'vitest';

import {
    buildDicomQuery,
    buildDicomSearch,
    buildInitialDicomQuery,
    DEFAULT_DICOM_SEARCH_FIELDS,
    parseDicomDateRange,
} from './dicomSearch';
import { PatientImagingProps } from '../types';

describe('buildInitialDicomQuery', () => {
    const today = moment('2026-11-17');

    it('prefills StudyDate one day wider than the range on each side', () => {
        expect(buildInitialDicomQuery({ defaultDateRangeDays: 7 }, today)).toEqual({
            StudyDate: '20261109-20261118',
        });
    });

    it('defaults to 14 days, and lets defaultQueryParams override StudyDate', () => {
        expect(buildInitialDicomQuery({}, today).StudyDate).toBe('20261102-20261118');
        expect(
            buildInitialDicomQuery({ defaultQueryParams: { StudyDate: '20200101', ModalitiesInStudy: 'US' } }, today),
        ).toEqual({ StudyDate: '20200101', ModalitiesInStudy: 'US' });
    });
});

describe('buildDicomQuery', () => {
    it('drops empty criteria, trims, and lets fixed params win', () => {
        expect(
            buildDicomQuery(
                { PatientName: ' DOE* ', PatientID: '', ModalitiesInStudy: 'CT' },
                { ModalitiesInStudy: 'US' },
            ),
        ).toEqual({ PatientName: 'DOE*', ModalitiesInStudy: 'US' });
    });

    it('matches a PatientName without wildcards from its start', () => {
        expect(buildDicomQuery({ PatientName: ' doe ' })).toEqual({ PatientName: 'doe*' });
        expect(buildDicomQuery({ PatientName: 'DO?^JANE' })).toEqual({ PatientName: 'DO?^JANE' });
        expect(buildDicomQuery({ PatientName: '  ' })).toEqual({});
    });
});

describe('buildDicomSearch', () => {
    it("fixes the page's modalities and hides every fixed criterion's field", () => {
        expect(buildDicomSearch({ fixedQueryParams: { AccessionNumber: 'A1' } }, ['US'])).toEqual({
            fields: ['PatientID', 'PatientName', 'StudyDate'],
            fixedQueryParams: { AccessionNumber: 'A1', ModalitiesInStudy: 'US' },
        });
    });

    it('leaves Type to the user when the page names no modalities', () => {
        expect(
            buildDicomSearch({ fields: ['ModalitiesInStudy'], defaultQueryParams: { ModalitiesInStudy: 'CT' } }),
        ).toEqual({
            fields: ['ModalitiesInStudy'],
            defaultQueryParams: { ModalitiesInStudy: 'CT' },
            fixedQueryParams: {},
        });
        expect(buildDicomSearch({}).fields).toEqual(DEFAULT_DICOM_SEARCH_FIELDS);
    });

    it('takes the modality only from the page', () => {
        const options: Omit<PatientImagingProps, 'patient'> = {
            modalities: ['US'],
            dicomSearch: {
                // @ts-expect-error The search's fixed modality comes from `modalities`.
                fixedQueryParams: { ModalitiesInStudy: 'CT' },
            },
        };
        expect(options.modalities).toEqual(['US']);
    });
});

describe('parseDicomDateRange', () => {
    it('parses a range and ignores a single date', () => {
        const [from, to] = parseDicomDateRange('20261101-20261117')!;
        expect([from.format('YYYY-MM-DD'), to.format('YYYY-MM-DD')]).toEqual(['2026-11-01', '2026-11-17']);
        expect(parseDicomDateRange('20261101')).toBeUndefined();
    });
});
