// Integration tests for ResourceListPage batch launch context enrichment (getClinicalContext + batch context merge).

import { waitFor } from '@testing-library/react';
import { ParametersParameter, Patient, Practitioner } from 'fhir/r4b';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createPractitioner, loginAdminUser } from 'src/setupTests';

import {
    activateTestLocale,
    clearAllCapturedProps,
    createTestPatients,
    expectBundleParameter,
    expectParametersNamed,
    getLatestBatchLaunchContext,
    getLatestQrfLaunchContext,
    getLatestQrfMergedLaunchContext,
    openBatchQuestionnaireModal,
    renderResourceListPage,
    RenderResourceListPageProps,
    searchParamsForPatients,
    selectAllRows,
    TEST_PATIENT_DISPLAY_NAMES,
    waitForBatchLaunchContextWithPatients,
    waitForPatientsInTable,
} from './resourceListPageBatchContext.test-utils';
// Import actions after test-utils so the QuestionnaireResponseForm mock is registered first.
import { questionnaireAction } from '../actions';
import { RecordType } from '../types';

type ClinicalContextResourceListPageProps = RenderResourceListPageProps & {
    getClinicalContext?: (record: RecordType<Patient> | undefined) => ParametersParameter[];
};

function renderClinicalContextResourceListPage(
    practitioner: Practitioner,
    props: ClinicalContextResourceListPageProps = {},
) {
    return renderResourceListPage(practitioner, props as RenderResourceListPageProps);
}

describe('ResourceListPage batch launch context (clinical-context — enrichment)', () => {
    beforeEach(async () => {
        clearAllCapturedProps();
        activateTestLocale();
        await loginAdminUser();
    });

    it('passes enriched defaultLaunchContext to BatchActions and QRF with Bundle when rows are selected', async () => {
        const practitioner = await createPractitioner({
            name: [{ given: ['Alice'], family: 'Smith' }],
        });
        const patients = await createTestPatients();
        const patient1 = patients[0]!;
        const patient2 = patients[1]!;

        renderClinicalContextResourceListPage(practitioner, {
            searchParams: searchParamsForPatients(patients),
        });

        await waitForPatientsInTable(...TEST_PATIENT_DISPLAY_NAMES);
        await selectAllRows();
        await waitForBatchLaunchContextWithPatients(patient1.id!, patient2.id!);

        const batchLaunchContext = getLatestBatchLaunchContext();

        await openBatchQuestionnaireModal();

        const batchQrfContext = getLatestQrfLaunchContext();

        expectParametersNamed(batchLaunchContext, 'Author', practitioner.id!);
        expectParametersNamed(batchLaunchContext, 'Patient', patient1.id!);
        expectParametersNamed(batchLaunchContext, 'patient', patient1.id!);
        expectParametersNamed(batchLaunchContext, 'Patient', patient2.id!);
        expectParametersNamed(batchLaunchContext, 'patient', patient2.id!);
        expect(batchLaunchContext).toHaveLength(5);

        const qrfLaunchContext = batchQrfContext;

        expectParametersNamed(qrfLaunchContext, 'Author', practitioner.id!);
        expectParametersNamed(qrfLaunchContext, 'Patient', patient1.id!);
        expectParametersNamed(qrfLaunchContext, 'patient', patient1.id!);
        expectParametersNamed(qrfLaunchContext, 'Patient', patient2.id!);
        expectParametersNamed(qrfLaunchContext, 'patient', patient2.id!);
        expectBundleParameter(qrfLaunchContext, patient1.id!, patient2.id!);
        expect(qrfLaunchContext).toHaveLength(6);
    });

    it('uses getClinicalContext for each selected resource when provided', async () => {
        const practitioner = await createPractitioner({
            name: [{ given: ['Alice'], family: 'Smith' }],
        });
        const patients = await createTestPatients();
        const patient1 = patients[0]!;
        const patient2 = patients[1]!;
        const getClinicalContext = vi.fn((record) => [{ name: 'SelectedPatient', resource: record!.resource }]);

        renderClinicalContextResourceListPage(practitioner, {
            searchParams: searchParamsForPatients(patients),
            getClinicalContext,
        });

        await waitForPatientsInTable(...TEST_PATIENT_DISPLAY_NAMES);
        await selectAllRows();

        await waitFor(() => {
            expect(getClinicalContext).toHaveBeenCalledTimes(2);
        });

        expect(getClinicalContext).toHaveBeenCalledWith(
            expect.objectContaining({
                resource: expect.objectContaining({ id: patient1.id }),
                bundle: expect.objectContaining({ type: 'collection' }),
            }),
        );
        expect(getClinicalContext).toHaveBeenCalledWith(
            expect.objectContaining({
                resource: expect.objectContaining({ id: patient2.id }),
                bundle: expect.objectContaining({ type: 'collection' }),
            }),
        );

        const batchLaunchContext = getLatestBatchLaunchContext();

        expectParametersNamed(batchLaunchContext, 'Author', practitioner.id!);
        expectParametersNamed(batchLaunchContext, 'SelectedPatient', patient1.id!);
        expectParametersNamed(batchLaunchContext, 'SelectedPatient', patient2.id!);
        expect(batchLaunchContext).toHaveLength(3);

        await openBatchQuestionnaireModal();

        const qrfLaunchContext = getLatestQrfLaunchContext();

        expectParametersNamed(qrfLaunchContext, 'Author', practitioner.id!);
        expectParametersNamed(qrfLaunchContext, 'SelectedPatient', patient1.id!);
        expectParametersNamed(qrfLaunchContext, 'SelectedPatient', patient2.id!);
        expectBundleParameter(qrfLaunchContext, patient1.id!, patient2.id!);
        expect(qrfLaunchContext).toHaveLength(4);
    });

    it('merges action.extra.qrfProps.launchContextParameters into QRF launch context', async () => {
        const practitioner = await createPractitioner({
            name: [{ given: ['Alice'], family: 'Smith' }],
        });
        const patients = await createTestPatients();
        const patient1 = patients[0]!;
        const patient2 = patients[1]!;

        renderClinicalContextResourceListPage(practitioner, {
            searchParams: searchParamsForPatients(patients),
            getBatchActions: () => [
                questionnaireAction('Batch action', 'batch-questionnaire', {
                    extra: {
                        qrfProps: {
                            launchContextParameters: [
                                { name: 'Extra', resource: { resourceType: 'Organization', id: 'org-1' } },
                            ],
                        },
                    },
                }),
            ],
        });

        await waitForPatientsInTable(...TEST_PATIENT_DISPLAY_NAMES);
        await selectAllRows();
        await openBatchQuestionnaireModal();

        const qrfLaunchContext = getLatestQrfLaunchContext();

        expectParametersNamed(qrfLaunchContext, 'Author', practitioner.id!);
        expectParametersNamed(qrfLaunchContext, 'Extra', 'org-1');
        expectBundleParameter(qrfLaunchContext, patient1.id!, patient2.id!);

        const extraIndex = qrfLaunchContext.findIndex((parameter) => parameter.name === 'Extra');
        const bundleIndex = qrfLaunchContext.findIndex((parameter) => parameter.name === 'Bundle');

        expect(extraIndex).toBeGreaterThan(-1);
        expect(bundleIndex).toBeGreaterThan(extraIndex);
    });

    it('passes only page defaultLaunchContext when nothing is selected', async () => {
        const practitioner = await createPractitioner({
            name: [{ given: ['Alice'], family: 'Smith' }],
        });
        const patients = await createTestPatients();

        renderClinicalContextResourceListPage(practitioner, {
            searchParams: searchParamsForPatients(patients),
        });

        await waitForPatientsInTable(...TEST_PATIENT_DISPLAY_NAMES);

        const launchContext = getLatestBatchLaunchContext();

        expectParametersNamed(launchContext, 'Author', practitioner.id!);
        expect(launchContext).toHaveLength(1);
    });

    describe('ClinicalContext merge at QRF', () => {
        it('includes ancestor ClinicalContext params in effective QRF launch context', async () => {
            const practitioner = await createPractitioner({
                name: [{ given: ['Alice'], family: 'Smith' }],
            });
            const patients = await createTestPatients();
            const patient1 = patients[0]!;
            const patient2 = patients[1]!;

            renderClinicalContextResourceListPage(practitioner, {
                searchParams: searchParamsForPatients(patients),
                ancestorClinicalContext: [
                    { name: 'Organization', resource: { resourceType: 'Organization', id: 'org-1' } },
                ],
            });

            await waitForPatientsInTable(...TEST_PATIENT_DISPLAY_NAMES);
            await selectAllRows();
            await openBatchQuestionnaireModal();

            const qrfLaunchContext = getLatestQrfLaunchContext();
            const mergedLaunchContext = getLatestQrfMergedLaunchContext();

            expectParametersNamed(qrfLaunchContext, 'Author', practitioner.id!);
            expectParametersNamed(qrfLaunchContext, 'Patient', patient1.id!);
            expectParametersNamed(qrfLaunchContext, 'Patient', patient2.id!);
            expectBundleParameter(qrfLaunchContext, patient1.id!, patient2.id!);
            expect(qrfLaunchContext).toHaveLength(6);

            expectParametersNamed(mergedLaunchContext, 'Organization', 'org-1');
            expectParametersNamed(mergedLaunchContext, 'Author', practitioner.id!);
            expectParametersNamed(mergedLaunchContext, 'Patient', patient1.id!);
            expectParametersNamed(mergedLaunchContext, 'Patient', patient2.id!);
            expectBundleParameter(mergedLaunchContext, patient1.id!, patient2.id!);
            expect(mergedLaunchContext).toHaveLength(7);
        });

        it('lets QRF launchContextParameters override ancestor ClinicalContext for the same name', async () => {
            const practitioner = await createPractitioner({
                name: [{ given: ['Alice'], family: 'Smith' }],
            });
            const otherPractitioner = await createPractitioner({
                name: [{ given: ['Bob'], family: 'Jones' }],
            });
            const patients = await createTestPatients();

            renderClinicalContextResourceListPage(practitioner, {
                searchParams: searchParamsForPatients(patients),
                ancestorClinicalContext: [{ name: 'Author', resource: otherPractitioner }],
            });

            await waitForPatientsInTable(...TEST_PATIENT_DISPLAY_NAMES);
            await selectAllRows();
            await openBatchQuestionnaireModal();

            const mergedLaunchContext = getLatestQrfMergedLaunchContext();

            expectParametersNamed(mergedLaunchContext, 'Author', practitioner.id!);
            expect(
                mergedLaunchContext.some(
                    (parameter) => parameter.name === 'Author' && parameter.resource?.id === otherPractitioner.id,
                ),
            ).toBe(false);
        });

        it('uses the same effective context as the QRF prop when ancestor ClinicalContext is empty', async () => {
            const practitioner = await createPractitioner({
                name: [{ given: ['Alice'], family: 'Smith' }],
            });
            const patients = await createTestPatients();
            const patient1 = patients[0]!;
            const patient2 = patients[1]!;

            renderClinicalContextResourceListPage(practitioner, {
                searchParams: searchParamsForPatients(patients),
            });

            await waitForPatientsInTable(...TEST_PATIENT_DISPLAY_NAMES);
            await selectAllRows();
            await openBatchQuestionnaireModal();

            expect(getLatestQrfMergedLaunchContext()).toEqual(getLatestQrfLaunchContext());
            expectParametersNamed(getLatestQrfMergedLaunchContext(), 'Author', practitioner.id!);
            expectBundleParameter(getLatestQrfMergedLaunchContext(), patient1.id!, patient2.id!);
        });

        it('merges ancestor ClinicalContext with action.extra.qrfProps.launchContextParameters', async () => {
            const practitioner = await createPractitioner({
                name: [{ given: ['Alice'], family: 'Smith' }],
            });
            const patients = await createTestPatients();
            const patient1 = patients[0]!;
            const patient2 = patients[1]!;

            renderClinicalContextResourceListPage(practitioner, {
                searchParams: searchParamsForPatients(patients),
                ancestorClinicalContext: [
                    { name: 'Organization', resource: { resourceType: 'Organization', id: 'org-ancestor' } },
                ],
                getBatchActions: () => [
                    questionnaireAction('Batch action', 'batch-questionnaire', {
                        extra: {
                            qrfProps: {
                                launchContextParameters: [
                                    { name: 'Extra', resource: { resourceType: 'Organization', id: 'org-1' } },
                                ],
                            },
                        },
                    }),
                ],
            });

            await waitForPatientsInTable(...TEST_PATIENT_DISPLAY_NAMES);
            await selectAllRows();
            await openBatchQuestionnaireModal();

            const mergedLaunchContext = getLatestQrfMergedLaunchContext();

            expectParametersNamed(mergedLaunchContext, 'Organization', 'org-ancestor');
            expectParametersNamed(mergedLaunchContext, 'Author', practitioner.id!);
            expectParametersNamed(mergedLaunchContext, 'Extra', 'org-1');
            expectBundleParameter(mergedLaunchContext, patient1.id!, patient2.id!);

            const extraIndex = mergedLaunchContext.findIndex((parameter) => parameter.name === 'Extra');
            const bundleIndex = mergedLaunchContext.findIndex((parameter) => parameter.name === 'Bundle');

            expect(extraIndex).toBeGreaterThan(-1);
            expect(bundleIndex).toBeGreaterThan(extraIndex);
        });
    });
});
