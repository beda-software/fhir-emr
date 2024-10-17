import {
    Reference as FHIRReference,
    Extension as FHIRExtension,
    QuestionnaireItem as FHIRQuestionnaireItem,
} from 'fhir/r4b';

import {
    Extension as FCEExtension,
    QuestionnaireItem as FCEQuestionnaireItem,
    InternalReference,
} from '@beda.software/aidbox-types';

import { ExtensionIdentifier, extensionTransformers } from './extensions';
import { fromFirstClassExtension } from './fceToFhir';
import { toFirstClassExtension } from './fhirToFce';
import { processLaunchContext as processLaunchContextToFce } from './fhirToFce/questionnaire/processExtensions';

export function convertFromFHIRExtension(extension: FHIRExtension): Partial<FCEQuestionnaireItem> | undefined {
    const identifier = extension.url;
    const transformer = extensionTransformers[identifier as ExtensionIdentifier];
    if (transformer !== undefined) {
        if ('transform' in transformer) {
            return transformer.transform.fromExtension(extension);
        } else {
            return { [transformer.path.questionnaire]: extension[transformer.path.extension] };
        }
    }
}

export function convertFromFHIRExtensions(extensions: FHIRExtension[]): Partial<FCEQuestionnaireItem> | undefined {
    if (extensions && extensions.length > 0) {
        const itemExtension = extensions.map((extension) => {
            const identifier = extension.url;
            const transformer = extensionTransformers[identifier as ExtensionIdentifier];
            if (transformer !== undefined) {
                if ('transform' in transformer) {
                    return transformer.transform.fromExtension(extension);
                } else {
                    return { [transformer.path.questionnaire]: extension[transformer.path.extension] };
                }
            }
        });
        const mergedExtension = itemExtension.reduce((acc, extension) => {
            if (extension && extension.constraint) {
                acc?.constraint?.push(...extension.constraint);
            }
            return acc;
        }, itemExtension[0]);

        return mergedExtension;
    }
    return undefined;
}

export function convertToFHIRExtension(item: FCEQuestionnaireItem): FHIRExtension[] {
    const extensions: FHIRExtension[] = [];
    Object.values(ExtensionIdentifier).forEach((identifier) => {
        const transformer = extensionTransformers[identifier];
        if ('transform' in transformer) {
            const extension = transformer.transform.toExtension(item);
            if (extension !== undefined) {
                extensions.push(extension);
            }
        } else {
            const extensionValue = item[transformer.path.questionnaire];
            if (extensionValue !== undefined) {
                const extension: FHIRExtension = {
                    [transformer.path.extension]: extensionValue,
                    url: identifier,
                };
                extensions.push(extension);
            }
        }
    });
    return extensions;
}

export function extractExtension(extension: FCEExtension[] | undefined, url: 'ex:createdAt') {
    return extension?.find((e) => e.url === url)?.valueInstant;
}

export function findExtension(item: FHIRQuestionnaireItem, url: string) {
    return item.extension?.find((ext) => ext.url === url);
}

export function findExtensions(item: FHIRQuestionnaireItem, url: string) {
    return item.extension?.filter((ext) => ext.url === url);
}

export function fromFHIRReference(r?: FHIRReference): InternalReference | undefined {
    if (!r || !r.reference) {
        return undefined;
    }

    const { reference: literalReference, ...commonReferenceProperties } = r;
    const isHistoryVersionLink = r.reference.split('/').slice(-2, -1)[0] === '_history';

    if (isHistoryVersionLink) {
        const [, , id, resourceType] = r.reference.split('/').reverse();

        return {
            ...commonReferenceProperties,
            id: id!,
            resourceType,
        };
    } else {
        const [id, resourceType] = r.reference.split('/').reverse();

        return {
            ...commonReferenceProperties,
            id: id!,
            resourceType,
        };
    }
}

export function toFHIRReference(r?: InternalReference): FHIRReference | undefined {
    if (!r) {
        return undefined;
    }

    const { id, resourceType, ...commonReferenceProperties } = r;

    delete commonReferenceProperties.resource;

    return {
        ...commonReferenceProperties,
        reference: `${resourceType}/${id}`,
    };
}

export { toFirstClassExtension, fromFirstClassExtension, processLaunchContextToFce };
