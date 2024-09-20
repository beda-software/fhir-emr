import { FhirResource, Schedule, Slot } from 'fhir/r4b';
import fhirpath from 'fhirpath';

import { ensure, parseFHIRDateTime, withRootAccess } from '@beda.software/fhir-react';

import { axiosInstance, createFHIRResource } from './fhir';
import { loadResourceOptions } from './questionnaire';

// import { UserInvocationTable } from 'fhirpath';

function evaluate<R extends FhirResource>(fhirData: R, path: string) {
    // https://github.com/beda-software/FHIRPathMappingLanguage/blob/4d2cd61f138de15abd7ba1c93d504951e3881da6/ts/server/src/app.service.ts#L14-L29
    const userInvocationTable: UserInvocationTable = {
        formatDate: {
            fn: (inputs: string[], format: string) => {
                return inputs.map((i) => parseFHIRDateTime(i).format(format));
            },
            arity: { 0: [], 1: ['String'] },
        },
    };
    return fhirpath.evaluate(fhirData, path, undefined, undefined, { userInvocationTable });
}

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
            ensure(await loadResourceOptions('Slot', {}, getDisplay)),
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
