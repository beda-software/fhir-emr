import { Extension, Questionnaire, QuestionnaireItem } from 'fhir/r4b';
import _ from 'lodash';

import { evaluate } from 'src/utils';

const launchContextUrl = 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-launchContext';

const patientLaunch: Extension = {
    url: launchContextUrl,
    extension: [
        {
            url: 'name',
            valueCoding: {
                code: 'Patient',
            },
        },
        {
            url: 'type',
            valueCode: 'Patient',
        },
    ],
};

const encounterLaunch: Extension = {
    url: launchContextUrl,
    extension: [
        {
            url: 'name',
            valueCoding: {
                code: 'Encounter',
            },
        },
        {
            url: 'type',
            valueCode: 'Encounter',
        },
    ],
};

const patientIdQuestion: QuestionnaireItem = {
    text: 'PatientId',
    type: 'string',
    extension: [
        {
            url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-hidden',
            valueBoolean: true,
        },
        {
            url: 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-initialExpression',
            valueExpression: {
                language: 'text/fhirpath',
                expression: '%Patient.id',
            },
        },
    ],
    linkId: 'patientId',
};

const encounterIdQuestion: QuestionnaireItem = {
    text: 'EncounterId',
    type: 'string',
    extension: [
        {
            url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-hidden',
            valueBoolean: true,
        },
        {
            url: 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-initialExpression',
            valueExpression: {
                language: 'text/fhirpath',
                expression: '%Encounter.id',
            },
        },
    ],
    linkId: 'encounterId',
};

export function prepareQuestionnaire(q: Questionnaire): Questionnaire {
    const { subjectType, title } = q;
    let { item, extension } = q;
    const name = _.kebabCase(title?.toLowerCase());
    const existingLaunchContexts = evaluate(
        q,
        `Questionnaire.extension('${launchContextUrl}').extension('name').valueCoding.code`,
    );
    const hasPatientIdQuestion = evaluate(q, "Questionnaire.repeat(item).where(linkId='patientId')").length > 0;
    const hasEncounterIdQuestion = evaluate(q, "Questionnaire.repeat(item).where(linkId='encounterId')").length > 0;

    if (subjectType?.includes('Encounter') || subjectType?.includes('Patient')) {
        if (!existingLaunchContexts.includes('Patient')) {
            extension = [...(extension ?? []), patientLaunch];
        }
        if (!hasPatientIdQuestion) {
            item = [...(item ?? []), patientIdQuestion];
        }
    }
    if (subjectType?.includes('Encounter')) {
        if (!existingLaunchContexts.includes('Encounter')) {
            extension = [...(extension ?? []), encounterLaunch];
        }
        if (!hasEncounterIdQuestion) {
            item = [...(item ?? []), encounterIdQuestion];
        }
    }
    return { ...q, ...(name ? { name } : {}), ...(item ? { item } : {}), ...(extension ? { extension } : {}) };
}
