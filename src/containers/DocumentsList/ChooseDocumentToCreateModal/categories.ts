import { t } from '@lingui/macro';
import { Questionnaire } from 'fhir/r4b';

export const QUESTIONNAIRE_CATEGORY_SYSTEM = 'https://beda.software/FHIR/CodeSystem/questionnaire-category';

export interface DocumentCategory {
    code: string;
    label: string;
}

export function getFormLibraryDocumentCategories(): DocumentCategory[] {
    return [
        { code: 'paediatrics', label: t`Paediatrics` },
        { code: 'mental-health', label: t`Mental Health` },
        { code: 'gp', label: t`GP` },
        { code: 'common', label: t`Common` },
        { code: 'other', label: t`Others` },
    ];
}

function getQuestionnaireCategories(q: Questionnaire): string[] {
    const codes: string[] = [];
    for (const ctx of q.useContext ?? []) {
        for (const coding of ctx.valueCodeableConcept?.coding ?? []) {
            if (coding.system === QUESTIONNAIRE_CATEGORY_SYSTEM && coding.code) {
                codes.push(coding.code);
            }
        }
    }
    return codes;
}

export function groupQuestionnairesByCategory(
    questionnaires: Questionnaire[],
    categories: DocumentCategory[],
): Map<string, Questionnaire[]> {
    const result = new Map<string, Questionnaire[]>();
    for (const category of categories) {
        const bucket = questionnaires.filter((q) => getQuestionnaireCategories(q).includes(category.code));
        result.set(category.code, bucket);
    }
    return result;
}
