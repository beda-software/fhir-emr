import { Schedule, Slot } from 'fhir/r4b';
import { UserInvocationTable } from 'fhirpath';

import { ensure, parseFHIRDateTime, withRootAccess } from '@beda.software/fhir-react';

import { evaluate, initFHIRPathEvaluateOptions } from 'src/utils';

import { axiosInstance, createFHIRResource } from './fhir';
import { loadResourceOptions } from './questionnaire';

const start = '2024-09-20T00:00:00Z';
// const startString = 'Friday • 20 Sep • 12:00 AM';
// string representation should be calculated to aviod issue with different timezones
// Formating is depends on the timezone where test is running
const startString = parseFHIRDateTime(start).format('dddd • D MMM • h:mm A');

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
            start,
            end: '2024-09-20T00:30:00Z',
        };
        return ensure(await createFHIRResource(slot));
    });
}

describe('Custom fhirpath invocation for reference option display', () => {
    test('Not implemented function', async () => {
        const slot = await setup();
        expect(() => {
            evaluate(slot, "Slot.start.formatDate('dddd • D MMM • h:mm A')");
        }).toThrow('Not implemented: formatDate');
    });
    test('Init FHIRPath evaluate options works', async () => {
        const slot = await setup();

        initFHIRPathEvaluateOptions(formatDateUserInvocationTable);
        const result = evaluate(slot, "Slot.start.formatDate('dddd • D MMM • h:mm A')");
        expect(result).toEqual([startString]);
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
            ensure(await loadResourceOptions('Slot', { id: slot.id }, undefined, getDisplay)),
        );

        expect(options).toEqual([
            {
                value: {
                    Reference: {
                        display: startString,
                        id: slot.id,
                        resourceType: 'Slot',
                    },
                },
            },
        ]);
    });
});

describe('Default fhirpath functions work', () => {
    test('Function toString() works correctly', async () => {
        initFHIRPathEvaluateOptions(formatDateUserInvocationTable);
        const result = evaluate({ x: 10 }, 'x.toString()');
        expect(result).toEqual(['10']);
    });
});
