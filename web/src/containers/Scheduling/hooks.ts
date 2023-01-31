import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useService } from 'aidbox-react/lib/hooks/service';
import { extractBundleResources, getFHIRResources } from 'aidbox-react/lib/services/fhir';
import { mapSuccess } from 'aidbox-react/lib/services/service';

import { Practitioner, PractitionerRole } from 'shared/src/contrib/aidbox';

export function useScheduling() {
    const params = useParams<{ practitionerId: string }>();
    const practitionerId = params.practitionerId!;
    const [activeTab, setActiveTab] = useState('calendar');

    const [response] = useService(async () => {
        return mapSuccess(
            await getFHIRResources<Practitioner | PractitionerRole>('Practitioner', {
                _id: practitionerId,
                _revinclude: ['PractitionerRole:practitioner'],
            }),
            (bundle) => {
                const resources = extractBundleResources(bundle);

                return {
                    practitioner: resources.Practitioner[0]!,
                    practitionerRoles: resources.PractitionerRole,
                };
            },
        );
    });

    const onTabChange = useCallback((key: string) => {
        setActiveTab(key);
    }, []);

    return { response, onTabChange, activeTab };
}
