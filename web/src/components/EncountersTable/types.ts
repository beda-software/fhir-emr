import { Patient, Period, Practitioner } from 'shared/src/contrib/aidbox';

export interface EncounterData {
    id: string;
    patient: Patient | undefined;
    practitioner: Practitioner | undefined;
    status: string;
    period?: Period,
    humanReadableDate: string | undefined;
}
