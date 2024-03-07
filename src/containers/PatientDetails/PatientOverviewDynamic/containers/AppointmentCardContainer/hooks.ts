import { Patient, Appointment, Encounter, Bundle } from 'fhir/r4b';

import { WithId, useService } from '@beda.software/fhir-react';
import { mapSuccess, resolveMap } from '@beda.software/remote-data';

import { Query } from 'src/components/Dashboard/types';
import { prepareAppointments } from 'src/containers/PatientDetails/PatientOverviewDynamic/components/StandardCard/prepare';
import { getAllFHIRResources } from 'src/services/fhir';

export function useAppointmentCard(patient: Patient, query: Query) {
    const [response] = useService(async () => {
        return mapSuccess(
            await resolveMap({
                resourceBundle: getAllFHIRResources<Appointment | Encounter>(query.resourceType, query.search(patient)),
            }),
            ({ resourceBundle }) => {
                const appointments = prepareAppointments(resourceBundle as Bundle<WithId<Appointment | Encounter>>);
                return { appointments };
            },
        );
    }, []);

    return { response };
}
