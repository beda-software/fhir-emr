import { Questionnaire as FCEQuestionnaire } from 'shared/src/contrib/aidbox';

export function processExtensions(questionnaire: FCEQuestionnaire) {
    if (questionnaire.launchContext) {
        const extension: any[] = [];
        for (const launchContext of questionnaire.launchContext as any) {
            const name = launchContext.name;
            const typeList = launchContext.type;
            const description = launchContext.description;

            if (typeList) {
                for (const typeCode of typeList) {
                    const launchContextExtension: any = [
                        {
                            url: 'name',
                            valueCoding: name,
                        },
                        { url: 'type', valueCode: typeCode },
                    ];

                    if (description !== undefined) {
                        launchContextExtension.push({
                            url: 'description',
                            valueString: description,
                        });
                    }

                    extension.push({
                        url: 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-launchContext',
                        extension: launchContextExtension,
                    });
                }
            }
        }

        questionnaire.extension = questionnaire.extension || [];
        questionnaire.extension.push(...extension);
        delete questionnaire.launchContext;
    }

    if (questionnaire.mapping) {
        const mappingExtension = questionnaire.mapping.map((mapping) => ({
            url: 'http://beda.software/fhir-extensions/questionnaire-mapper',
            valueReference: {
                reference: `Mapping/${mapping.id}`,
            },
        }));
        questionnaire.extension = questionnaire.extension || [];
        questionnaire.extension.push(...mappingExtension);
        delete questionnaire.mapping;
    }

    if (questionnaire.sourceQueries) {
        const sourceQueries = questionnaire.sourceQueries;
        for (const item of sourceQueries) {
            const extension = {
                url: 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-sourceQueries',
                valueReference: { reference: `#${item.localRef}` },
            };
            questionnaire.extension = questionnaire.extension ?? [];
            questionnaire.extension.push(extension);
        }
        delete questionnaire.sourceQueries;
    }

    if (questionnaire.targetStructureMap) {
        const extensions = questionnaire.targetStructureMap.map((targetStructureMapRef) => ({
            url: 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-targetStructureMap',
            valueCanonical: targetStructureMapRef,
        }));

        questionnaire.extension = questionnaire.extension || [];
        questionnaire.extension.push(...extensions);
        delete questionnaire.targetStructureMap;
    }
}
