import { useParams } from 'react-router-dom';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';
import { useService } from 'aidbox-react/lib/hooks/service';
import { findFHIRResource } from 'aidbox-react/lib/services/fhir';

import { PractitionerRole } from 'shared/src/contrib/aidbox';

import { ScheduleCalendar } from './ScheduleCalendar';

function useScheduling(practitionerId: string) {
    const [response] = useService(async () => {
        return await findFHIRResource<PractitionerRole>('PractitionerRole', {
            practitioner: practitionerId,
        });
    });

    return { response };
}
export function Scheduling() {
    const params = useParams<{ practitionerId: string }>();
    const practitionerId = params.practitionerId!;
    const { response } = useScheduling(practitionerId);
    return (
        <RenderRemoteData remoteData={response}>
            {(practitionerRole) => <ScheduleCalendar practitionerRole={practitionerRole} />}
        </RenderRemoteData>
    );
}
