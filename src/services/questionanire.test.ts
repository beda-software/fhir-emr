import { Schedule, Slot } from 'fhir/r4b';

import { ensure, parseFHIRDateTime, withRootAccess } from '@beda.software/fhir-react';

import { evaluate, initFHIRPathEvaluateOptions } from 'src/utils';

import { axiosInstance, createFHIRResource } from './fhir';
import { loadResourceOptions } from './questionnaire';

const formatDateUserInvocationTable: UserInvocationTable = {
    formatDate: {
        fn: (inputs: string[], format: string) => {
            return inputs.map((i) => parseFHIRDateTime(i).format(format));
        },
        arity: { 0: [], 1: ['String'] },
    },
};

async function setup() {
    return await withRootAccess(axiosInstance, async () => {
        const scheduleData: Schedule = {
            resourceType: 'Schedule',
            actor: [{ display: 'Actor' }],
        };
        const schedule = ensure(await createFHIRResource(scheduleData));
        const slot: Slot = {
            resourceType: 'Slot',
            status: 'free',
            schedule: {
                reference: `Schedule/${schedule.id}`,
            },
            start: '2024-09-20T00:00:00Z',
            end: '2024-09-20T00:30:00Z',
        };
        return ensure(await createFHIRResource(slot));
    });
}

describe('Custom fhirpath invocation for reference option display', () => {
    test('Init FHIRPath evaluate options works', async () => {
        const slot = await setup();

        const expectedAnErrorMessage = 'Expected an error';

        try {
            evaluate(slot, "Slot.start.formatDate('dddd • D MMM • h:mm A')");
            throw new Error(expectedAnErrorMessage);
        } catch (e: any) {
            expect(e.message).not.toEqual(expectedAnErrorMessage);
            expect(e.message).toEqual('Not implemented: formatDate');
        }

        initFHIRPathEvaluateOptions(formatDateUserInvocationTable);
        const result = evaluate(slot, "Slot.start.formatDate('dddd • D MMM • h:mm A')");
        expect(result).toEqual(['Friday • 20 Sep • 12:00 AM']);
    });

    test('Load options', async () => {
        const slot = await setup();

        const getDisplay = (slot: Slot) => {
            const result = evaluate(slot, "Slot.start.formatDate('dddd • D MMM • h:mm A')");
            if (result.length == 1) {
                return `${result[0]}`;
            } else {
                return 'Unknown';
            }
        };

        const options = await withRootAccess(axiosInstance, async () =>
            ensure(await loadResourceOptions('Slot', { id: slot.id }, getDisplay)),
        );

        expect(options).toEqual([
            {
                value: {
                    Reference: {
                        display: 'Friday • 20 Sep • 12:00 AM',
                        id: slot.id,
                        resourceType: 'Slot',
                    },
                },
            },
        ]);
    });
});
