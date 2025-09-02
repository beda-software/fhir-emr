import { OperationOutcome } from 'fhir/r4b';

import { compileAsArray } from 'src/utils';

export const getErrorMessages = compileAsArray<OperationOutcome[], { div: string; status: string }>(
    'repeat(OperationOutcome).text',
);
