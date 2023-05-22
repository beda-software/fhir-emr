import {
    Reference as FHIRReference,
    Extension as FHIRExtension,
    QuestionnaireItem as FHIRQuestionnaireItem,
} from 'fhir/r4b';

import {
    Extension as FCEExtension,
    QuestionnaireItem as FCEQuestionnaireItem,
    InternalReference,
} from 'shared/src/contrib/aidbox';

import { ExtensionIdentifier, extensionTransformers } from './extensions';
import { fromFirstClassExtension } from './fceToFhir';
import { toFirstClassExtension } from './fhirToFce';
import { processLaunchContext as processLaunchContextToFce } from './fhirToFce/questionnaire/processExtensions';

export function convertFromFHIRExtension(
    identifier: ExtensionIdentifier,
    extension: FHIRExtension,
): Partial<FCEQuestionnaireItem> {
    const transformer = extensionTransformers[identifier];
    if ('transform' in transformer) {
        return transformer.transform.fromFHIR(extension);
    } else {
        return { [transformer.path.FCE]: extension[transformer.path.FHIR] };
    }
}

export function extractExtension(extension: FCEExtension[] | undefined, url: 'ex:createdAt') {
    return extension?.find((e) => e.url === url)?.valueInstant;
}

export function findExtension(item: FHIRQuestionnaireItem, url: string) {
    return item.extension?.find((ext) => ext.url === url);
}

export function fromFHIRReference(r?: FHIRReference): InternalReference | undefined {
    if (!r || !r.reference) {
        return undefined;
    }

    const { reference: literalReference, ...commonReferenceProperties } = r;

    const [id, resourceType] = r.reference.split('/').reverse();

    return {
        ...commonReferenceProperties,
        id: id!,
        resourceType,
    };
}

export function toFHIRReference(r?: InternalReference): FHIRReference | undefined {
    if (!r) {
        return undefined;
    }

    const { id, resourceType, ...commonReferenceProperties } = r;

    return {
        ...commonReferenceProperties,
        reference: `${resourceType}/${id}`,
    };
}

export { toFirstClassExtension, fromFirstClassExtension, processLaunchContextToFce };
