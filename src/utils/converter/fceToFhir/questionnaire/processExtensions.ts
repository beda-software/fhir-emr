import { Extension as FHIRExtension, Questionnaire as FHIRQuestionnaire } from 'fhir/r4b';

import { Questionnaire as FCEQuestionnaire } from '@beda.software/aidbox-types';

export function processExtensions(questionnaire: FCEQuestionnaire): FHIRQuestionnaire {
    const { launchContext, mapping, sourceQueries, targetStructureMap, ...fhirQuestionnaire } = questionnaire;

    let extensions: FHIRExtension[] = [];

    if (launchContext) {
        for (const launchContextItem of launchContext) {
            const name = launchContextItem.name;
            const typeList = launchContextItem.type;
            const description = launchContextItem.description;
            const launchContextExtension: FHIRExtension[] = [
                {
                    url: 'name',
                    valueCoding: name,
                },
            ];

            for (const typeCode of typeList ?? []) {
                launchContextExtension.push({ url: 'type', valueCode: typeCode });
            }

            if (description !== undefined) {
                launchContextExtension.push({
                    url: 'description',
                    valueString: description,
                });
            }

            extensions.push({
                url: 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-launchContext',
                extension: launchContextExtension,
            });
        }
    }

    if (mapping) {
        extensions = extensions.concat(
            mapping.map((m) => ({
                url: 'http://beda.software/fhir-extensions/questionnaire-mapper',
                valueReference: {
                    reference: `Mapping/${m.id}`,
                },
            })),
        );
    }

    if (sourceQueries) {
        extensions = extensions.concat(
            sourceQueries.map((item) => ({
                url: 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-sourceQueries',
                valueReference: { reference: `#${item.localRef}` },
            })),
        );
    }

    if (targetStructureMap) {
        extensions = extensions.concat(
            targetStructureMap.map((targetStructureMapRef) => ({
                url: 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-targetStructureMap',
                valueCanonical: targetStructureMapRef,
            })),
        );
    }

    if (extensions.length) {
        fhirQuestionnaire.extension = (fhirQuestionnaire.extension ?? []).concat(extensions);
    }

    return fhirQuestionnaire as FHIRQuestionnaire;
}
