import { Encounter, Patient, Period, Practitioner } from 'fhir/r4b';

export interface EncounterData {
    id: string;
    patient: Patient | undefined;
    practitioner: Practitioner | undefined;
    status: Encounter['status'];
    period?: Period;
    humanReadableDate: string | undefined;
}
