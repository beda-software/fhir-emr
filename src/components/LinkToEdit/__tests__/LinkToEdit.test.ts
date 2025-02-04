import { describe } from 'vitest';

import { getSourceFromProvenance } from '../utils';
import { Provenance } from 'fhir/r4b';

describe('getSourceFromProvenance', () => {
    test('getSourceFromProvenance for empty Provenance', () => {
        const provenance = {} as Provenance;

        expect(getSourceFromProvenance(provenance)).toBeUndefined();
    });

    test('getSourceFromProvenance for undefined Provenance', () => {
        expect(getSourceFromProvenance(undefined)).toBeUndefined();
    });

    test('getSourceFromProvenance for Provenance with source uri', () => {
        const provenance: Provenance = {
            resourceType: 'Provenance',
            entity: [
                {
                    role: 'source',
                    what: {
                        uri: 'QuestionnaireResponse/getme',
                    },
                },
            ],
            agent: [
                {
                    who: {},
                },
            ],
            target: [{}],
            recorded: '',
        };

        expect(getSourceFromProvenance(provenance)).toStrictEqual({
            resourceType: 'QuestionnaireResponse',
            id: 'getme',
        });
    });

    test('getSourceFromProvenance for Provenance without source uri', () => {
        const provenance: Provenance = {
            resourceType: 'Provenance',
            entity: [
                {
                    role: 'derivation',
                    what: {
                        uri: 'QuestionnaireResponse/getme',
                    },
                },
            ],
            agent: [
                {
                    who: {},
                },
            ],
            target: [{}],
            recorded: '',
        };

        expect(getSourceFromProvenance(provenance)).toBeUndefined();
    });

    test('getSourceFromProvenance for Provenance with source reference', () => {
        const provenance: Provenance = {
            resourceType: 'Provenance',
            entity: [
                {
                    role: 'source',
                    what: {
                        reference: 'QuestionnaireResponse/getme',
                    },
                },
            ],
            agent: [
                {
                    who: {},
                },
            ],
            target: [{}],
            recorded: '',
        };

        expect(getSourceFromProvenance(provenance)).toStrictEqual({
            resourceType: 'QuestionnaireResponse',
            id: 'getme',
        });
    });

    test('getSourceFromProvenance for Provenance without source reference', () => {
        const provenance: Provenance = {
            resourceType: 'Provenance',
            entity: [
                {
                    role: 'derivation',
                    what: {
                        reference: 'QuestionnaireResponse/getme',
                    },
                },
            ],
            agent: [
                {
                    who: {},
                },
            ],
            target: [{}],
            recorded: '',
        };

        expect(getSourceFromProvenance(provenance)).toBeUndefined();
    });
});
