import { Extension } from 'fhir/r4b';
import { compileAsFirst } from '.';

export const getExtensionExpression = compileAsFirst<Extension[] | undefined, string, true>(
    `where(url='expression').valueString.expression`,
);

export const getExtensionLanguage = compileAsFirst<Extension[] | undefined, string, true>(
    `where(url='expression').valueString.language`,
);
