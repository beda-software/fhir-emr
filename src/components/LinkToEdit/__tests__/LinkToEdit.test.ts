import { Provenance } from 'fhir/r4b';
import { describe } from 'vitest';

import { getLinkToEditUrl } from 'src/components/LinkToEdit/utils';

describe('getSourceFromProvenance', () => {
    test('getSourceFromProvenance for empty Provenance', () => {
        const provenance = {} as Provenance;
        const pathname = '/patients/patient1/resources';

        expect(getLinkToEditUrl({ provenance, pathname })).toBeUndefined();
    });

    test('getSourceFromProvenance for undefined Provenance', () => {
        expect(getLinkToEditUrl({})).toBeUndefined();
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
        const pathname = '/patients/patient1/resources';

        expect(getLinkToEditUrl({ provenance, pathname })).toEqual('/patients/patient1/documents/getme');
    });

    test('getSourceFromProvenance for Provenance with source reference and custom to', () => {
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
        const pathname = '/patients/patient1/resources';
        const to = '/custom';

        expect(getLinkToEditUrl({ provenance, pathname, to })).toEqual('/custom/getme');
    });
});
