import { Observation } from 'fhir/r4b';

enum ActivityGroup {
    energy = 'energy',
    exercise = 'exercise',
    standHours = 'standHours',
}

const ActivityObservationComponents: { [key in ActivityGroup]: { goal: string; quantity: string } } = {
    energy: { goal: 'active-energy-burned-goal', quantity: 'active-energy-burned' },
    exercise: { goal: 'exercise-time-goal', quantity: 'exercise-time' },
    standHours: { goal: 'stand-hours-goal', quantity: 'stand-hours' },
};

export function calculateGoalsProgress(activitySummary: Observation) {
    return {
        energy: calculateProgress(activitySummary, ActivityGroup.energy),
        exercise: calculateProgress(activitySummary, ActivityGroup.exercise),
        standHours: calculateProgress(activitySummary, ActivityGroup.standHours),
    };
}

function calculateProgress(activitySummary: Observation, activity: ActivityGroup) {
    const { quantity, goal } = findActivityComponents(activitySummary, ActivityObservationComponents[activity]);

    if (quantity?.value === undefined || goal?.value === undefined) {
        return undefined;
    }

    return quantity.value / goal.value;
}

function findActivityComponents(activitySummary: Observation, linkid: { goal: string; quantity: string }) {
    return {
        quantity: findComponentQuantity(activitySummary, linkid.quantity),
        goal: findComponentQuantity(activitySummary, linkid.goal),
    };
}

function findComponentQuantity(observation: Observation, linkid: string) {
    return observation.component?.find((c) => c.code.coding?.find(({ code }) => code === linkid))?.valueQuantity;
}
