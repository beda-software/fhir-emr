import { Patient, Practitioner } from 'shared/src/contrib/aidbox';

export interface EncounterData {
    id: string;
    patient: Patient | undefined;
    practitioner: Practitioner | undefined;
    status: string;
    date: string | undefined;
    humanReadableDate: string | undefined;
}
