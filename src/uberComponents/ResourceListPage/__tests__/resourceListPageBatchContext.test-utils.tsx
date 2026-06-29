import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { fireEvent, render, screen, waitFor, type RenderResult } from '@testing-library/react';
import { Bundle, ParametersParameter, Patient, Practitioner } from 'fhir/r4b';
import type { ComponentProps } from 'react';
import React from 'react';
import { expect, vi } from 'vitest';

import { ClinicalContext, getFirstParameter, getParameters } from '@beda.software/fhir-questionnaire';

import { createPatient } from 'src/setupTests';
import { ThemeProvider } from 'src/theme';
import { renderHumanName } from 'src/utils/fhir';

import { questionnaireAction } from '../actions';
import { ResourceListPage } from '../index';

export type CapturedQrfProps = {
    launchContextParameters?: ParametersParameter[];
    mergedLaunchContextParameters?: ParametersParameter[];
};

const batchContextTestState = vi.hoisted(() => ({
    capturedBatchActionsProps: [] as Array<{ defaultLaunchContext?: ParametersParameter[] }>,
    capturedQrfProps: [] as Array<{
        launchContextParameters?: ParametersParameter[];
        mergedLaunchContextParameters?: ParametersParameter[];
    }>,
}));

export const capturedBatchActionsProps = batchContextTestState.capturedBatchActionsProps;
export const capturedQrfProps = batchContextTestState.capturedQrfProps;

vi.mock('../BatchActions', async () => {
    const actual = await vi.importActual<typeof import('../BatchActions')>('../BatchActions');

    return {
        ...actual,
        BatchActions: (props: React.ComponentProps<typeof actual.BatchActions>) => {
            capturedBatchActionsProps.push(props);
            return React.createElement(actual.BatchActions, props);
        },
    };
});

vi.mock('src/components/QuestionnaireResponseForm', async () => {
    const { useClinicalContext, mergeLaunchContextParameters } = await import('@beda.software/fhir-questionnaire');

    function QuestionnaireResponseFormProbe(props: { launchContextParameters?: ParametersParameter[] }) {
        const { parameters: clinicalParams } = useClinicalContext();
        const mergedLaunchContextParameters = mergeLaunchContextParameters(
            clinicalParams,
            props.launchContextParameters ?? [],
        );

        capturedQrfProps.push({
            launchContextParameters: props.launchContextParameters,
            mergedLaunchContextParameters,
        });

        return null;
    }

    return {
        QuestionnaireResponseForm: QuestionnaireResponseFormProbe,
    };
});

export const TEST_PATIENT_NAMES = [
    { given: 'John', family: 'Doe' },
    { given: 'Jane', family: 'Foo' },
] as const;

export const TEST_PATIENT_DISPLAY_NAMES = TEST_PATIENT_NAMES.map(({ given, family }) =>
    renderHumanName({ given: [given], family }),
);

export async function createTestPatients(): Promise<Patient[]> {
    return Promise.all(
        TEST_PATIENT_NAMES.map(({ given, family }) =>
            createPatient({
                name: [{ given: [given], family }],
            }),
        ),
    );
}

export function searchParamsForPatients(patients: Patient[]) {
    return {
        _id: patients.map((patient) => patient.id).join(','),
        _count: 10,
    };
}

export function clearCapturedBatchActionsProps() {
    capturedBatchActionsProps.length = 0;
}

export function clearCapturedQrfProps() {
    capturedQrfProps.length = 0;
}

export function clearAllCapturedProps() {
    clearCapturedBatchActionsProps();
    clearCapturedQrfProps();
}

export type RenderResourceListPageProps = Partial<ComponentProps<typeof ResourceListPage<Patient>>> & {
    clinicalContext?: ParametersParameter[];
    ancestorClinicalContext?: ParametersParameter[];
};

export function renderResourceListPage(
    practitioner: Practitioner,
    props: RenderResourceListPageProps = {},
): RenderResult {
    const {
        clinicalContext = [{ name: 'Author', resource: practitioner }],
        ancestorClinicalContext = [],
        ...resourceListPageProps
    } = props;

    return render(
        <ThemeProvider>
            <I18nProvider i18n={i18n}>
                <ClinicalContext context={ancestorClinicalContext}>
                    <ResourceListPage<Patient>
                        headerTitle="Patients"
                        resourceType="Patient"
                        searchParams={{ _count: 10 }}
                        getTableColumns={() => [
                            {
                                title: 'Name',
                                dataIndex: 'name',
                                key: 'name',
                                render: (_text, record) => renderHumanName(record.resource.name?.[0]),
                            },
                        ]}
                        getBatchActions={() => [questionnaireAction('Batch action', 'batch-questionnaire')]}
                        defaultLaunchContext={clinicalContext}
                        {...resourceListPageProps}
                    />
                </ClinicalContext>
            </I18nProvider>
        </ThemeProvider>,
    );
}

export function getLatestBatchLaunchContext() {
    const latestProps = capturedBatchActionsProps.at(-1);

    expect(latestProps).toBeDefined();

    return latestProps!.defaultLaunchContext ?? [];
}

export function getLatestQrfLaunchContext() {
    const latestProps = capturedQrfProps.at(-1);

    expect(latestProps).toBeDefined();

    return latestProps!.launchContextParameters ?? [];
}

export function getLatestQrfMergedLaunchContext() {
    const latestProps = capturedQrfProps.at(-1);

    expect(latestProps).toBeDefined();

    return latestProps!.mergedLaunchContextParameters ?? [];
}

export function expectParametersNamed(parameters: ParametersParameter[], name: string, resourceId: string) {
    const matching = getParameters(parameters, name);

    expect(matching.some((parameter) => parameter.resource?.id === resourceId)).toBe(true);
}

export function expectBundleParameter(parameters: ParametersParameter[], ...patientIds: string[]) {
    const bundleParam = getFirstParameter(parameters, 'Bundle');

    expect(bundleParam).toBeDefined();
    expect(bundleParam!.resource).toMatchObject({ resourceType: 'Bundle', type: 'collection' });

    const bundle = bundleParam!.resource as Bundle;

    for (const patientId of patientIds) {
        expect(bundle.entry ?? []).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    resource: expect.objectContaining({ id: patientId }),
                }),
            ]),
        );
    }
}

export async function waitForPatientsInTable(...displayNames: string[]) {
    for (const displayName of displayNames) {
        await waitFor(() => {
            expect(screen.queryAllByText(displayName).length).toBeGreaterThan(0);
        });
    }
}

export async function selectAllRows() {
    fireEvent.click(screen.getByRole('checkbox', { name: 'Select all' }));
}

export async function openBatchQuestionnaireModal() {
    fireEvent.click(screen.getByRole('button', { name: 'Batch action' }));

    await waitFor(() => {
        expect(capturedQrfProps.length).toBeGreaterThan(0);
    });
}

export async function waitForBatchLaunchContextWithPatients(...patientIds: string[]) {
    await waitFor(() => {
        const launchContext = getLatestBatchLaunchContext();

        for (const patientId of patientIds) {
            expectParametersNamed(launchContext, 'Patient', patientId);
        }
    });
}

export function activateTestLocale() {
    i18n.activate('en');
}
