import { QuestionnaireResponse } from 'fhir/r4b';
import _ from 'lodash';

export function isExternalQuestionnaire(qr: QuestionnaireResponse): boolean {
    return _.startsWith(qr.questionnaire, 'http');
}

export function getExternalQuestionnaireName(qr: QuestionnaireResponse): string | undefined {
    const ext = qr._questionnaire?.extension?.find(
        ({ url }) => url === 'http://hl7.org/fhir/StructureDefinition/display',
    );

    return ext?.valueString || undefined;
}
