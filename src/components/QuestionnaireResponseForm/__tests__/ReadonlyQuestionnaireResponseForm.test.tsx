import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { act, render, screen } from '@testing-library/react';
import { Questionnaire, QuestionnaireResponse } from 'fhir/r4b';
import { describe, expect, test } from 'vitest';

import { toQuestionnaireResponseFormData } from '@beda.software/fhir-questionnaire/components';

import { ReadonlyQuestionnaireResponseForm } from 'src/components/QuestionnaireResponseForm';
import { ThemeProvider } from 'src/theme';

const questionnaire: Questionnaire = {
    resourceType: 'Questionnaire',
    id: 'visits',
    status: 'active',
    meta: {
        profile: ['https://emr-core.beda.software/StructureDefinition/fhir-emr-questionnaire'],
    },
    item: [
        {
            linkId: 'visits',
            text: 'Visits',
            type: 'group',
            repeats: true,
            item: [
                {
                    linkId: 'visit-note',
                    text: 'Note',
                    type: 'string',
                },
            ],
        },
    ],
};

const questionnaireResponse: QuestionnaireResponse = {
    resourceType: 'QuestionnaireResponse',
    status: 'completed',
    questionnaire: 'visits',
    item: [
        {
            linkId: 'visits',
            item: [{ linkId: 'visit-note', answer: [{ valueString: 'First visit' }] }],
        },
        {
            linkId: 'visits',
            item: [{ linkId: 'visit-note', answer: [{ valueString: 'Second visit' }] }],
        },
    ],
};

describe('ReadonlyQuestionnaireResponseForm', () => {
    test('renders a repeatable group without add and remove controls', async () => {
        act(() => {
            i18n.activate('en');
        });

        render(
            <ThemeProvider>
                <I18nProvider i18n={i18n}>
                    <ReadonlyQuestionnaireResponseForm
                        formData={toQuestionnaireResponseFormData(questionnaire, questionnaireResponse)}
                    />
                </I18nProvider>
            </ThemeProvider>,
        );

        expect(await screen.findByText('First visit')).toBeInTheDocument();
        expect(screen.getByText('Second visit')).toBeInTheDocument();
        expect(screen.queryByTestId('add-another-answer-button')).toBeNull();
        expect(screen.queryByTestId('remove-group-button')).toBeNull();
    });
});
