import { Questionnaire as FHIRQuestionnaire } from 'fhir/r4b';

export function processExtensions(fhirQuestionnaire: FHIRQuestionnaire): {
    launchContext?: any[];
    mapping?: any[];
    sourceQueries?: any[];
    targetStructureMap?: any[];
} {
    const launchContext = processLaunchContext(fhirQuestionnaire);
    const mapping = processMapping(fhirQuestionnaire);
    const sourceQueries = processSourceQueries(fhirQuestionnaire);
    const targetStructureMap = processTargetStructureMap(fhirQuestionnaire);

    return {
        launchContext: launchContext?.length ? launchContext : undefined,
        mapping: mapping?.length ? mapping : undefined,
        sourceQueries: sourceQueries?.length ? sourceQueries : undefined,
        targetStructureMap: targetStructureMap?.length ? targetStructureMap : undefined,
    };
}

export function processLaunchContext(fhirQuestionnaire: FHIRQuestionnaire): any[] | undefined {
    let launchContextExtensions = fhirQuestionnaire.extension ?? [];

    launchContextExtensions = launchContextExtensions.filter(
        (ext) => ext.url === 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-launchContext',
    );

    if (launchContextExtensions.length === 0) {
        return undefined;
    }

    const launchContextArray = [];
    for (const launchContextExtension of launchContextExtensions) {
        const nameExtension = launchContextExtension.extension?.find((ext) => ext.url === 'name');
        const typeExtensions = launchContextExtension.extension?.filter((ext) => ext.url === 'type');
        const descriptionExtension = launchContextExtension.extension?.find((ext) => ext.url === 'description');

        const nameCode = nameExtension?.valueCoding?.code;
        const typeCodes = typeExtensions?.map((typeExtension) => typeExtension.valueCode!);
        const description = descriptionExtension?.valueString;

        let contextFound = false;
        for (const context of launchContextArray) {
            if (context.name.code === nameCode) {
                context.type.push(...(typeCodes ?? []));
                contextFound = true;
                break;
            }
        }

        if (!contextFound) {
            const context: any = {
                name: nameExtension?.valueCoding,
                type: typeCodes ?? [],
            };
            if (description) {
                context.description = description;
            }
            launchContextArray.push(context);
        }
    }

    return launchContextArray;
}

function processMapping(fhirQuestionnaire: FHIRQuestionnaire): any[] | undefined {
    const mapperExtensions = fhirQuestionnaire.extension?.filter(
        (ext: any) => ext.url === 'http://beda.software/fhir-extensions/questionnaire-mapper',
    );

    if (!mapperExtensions) {
        return undefined;
    }

    return mapperExtensions.map((mapperExtension: any) => ({
        id: mapperExtension.valueReference?.reference?.split('/')[1],
        resourceType: 'Mapping',
    }));
}

function processSourceQueries(fhirQuestionnaire: FHIRQuestionnaire): any[] {
    const extensions =
        fhirQuestionnaire.extension?.filter(
            (ext) => ext.url === 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-sourceQueries',
        ) ?? [];

    return extensions.map((ext) => ({
        localRef: ext.valueReference?.reference?.substring(1) ?? '',
    }));
}

function processTargetStructureMap(fhirQuestionnaire: FHIRQuestionnaire): string[] | undefined {
    const extensions = fhirQuestionnaire.extension?.filter(
        (ext) => ext.url === 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-targetStructureMap',
    );

    if (!extensions) {
        return undefined;
    }

    return extensions.map((extension) => extension.valueCanonical!);
}
