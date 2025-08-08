import { Questionnaire } from 'fhir/r4b';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { extractBundleResources, useService, WithId } from '@beda.software/fhir-react';
import { resolveMap, mapSuccess } from '@beda.software/remote-data';

import { getFHIRResources } from 'src/services';

interface PatientDocumentWizardResponse {
    questionnaires: WithId<Questionnaire>[];
}

export function usePatientDocumentWizard() {
    const { questionnairesIds: questionnairesIdsString } = useParams<{ questionnairesIds: string }>();

    const questionnairesIds = useMemo(() => {
        return questionnairesIdsString?.split(',') ?? [];
    }, [questionnairesIdsString]);

    const [response] = useService<PatientDocumentWizardResponse>(async () => {
        return mapSuccess(
            await resolveMap({
                questionnaireBundle: getFHIRResources<WithId<Questionnaire>>('Questionnaire', {
                    _id: questionnairesIds.join(','),
                    _elements: 'id,title',
                }),
            }),
            ({ questionnaireBundle }) => {
                const questionnaires = extractBundleResources(questionnaireBundle).Questionnaire?.sort((a, b) => {
                    const aIndex = questionnairesIds.findIndex((q) => q === a.id);
                    const bIndex = questionnairesIds.findIndex((q) => q === b.id);
                    return aIndex - bIndex;
                });
                return {
                    questionnaires,
                };
            },
        );
    });

    return {
        response,
    };
}
