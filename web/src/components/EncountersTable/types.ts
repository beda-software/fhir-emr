import { WithId } from 'aidbox-react/lib/services/fhir';
import { Patient, Practitioner } from 'shared/src/contrib/aidbox';

export interface EncounterData {
    id: string;
    patient?: WithId<Patient>;
    practitioner?: WithId<Practitioner>;
    status: string;
    date: string | undefined;
    humanReadableDate: string | undefined;
}
