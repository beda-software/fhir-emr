export interface EncounterData {
    key: string;
    patient: string;
    practitioner: string;
    status: string;
    date: string | undefined;
    humanReadableDate: string | undefined;
}
