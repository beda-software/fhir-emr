import { Outlet, Route, Routes, useNavigate, useParams } from 'react-router-dom';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';
import { useService } from 'aidbox-react/lib/hooks/service';
import { extractBundleResources, getFHIRResources, WithId } from 'aidbox-react/lib/services/fhir';
import { mapSuccess } from 'aidbox-react/lib/services/service';

import { Practitioner, PractitionerRole } from 'shared/src/contrib/aidbox';

import { BasePageContent } from 'src/components/BaseLayout';
import { Spinner } from 'src/components/Spinner';

import { Availability } from '../Scheduling/Availability';
import { ScheduleCalendar } from '../Scheduling/ScheduleCalendar';
import { PractitionerHeader } from './PractitionerHeader';
import { PractitionerOverview } from './PractitionerOverview';

export const PractitionerDetails = () => {
    const params = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [response, manager] = useService(async () => {
        return mapSuccess(
            await getFHIRResources<Practitioner | PractitionerRole>('Practitioner', {
                _id: params.id,
                _revinclude: ['PractitionerRole:practitioner'],
            }),
            (bundle) => {
                const resources = extractBundleResources(bundle);

                return {
                    practitioner: resources.Practitioner[0]!,
                    practitionerRole: resources.PractitionerRole[0]!,
                };
            },
        );
    });

    return (
        <RenderRemoteData remoteData={response} renderLoading={Spinner}>
            {({ practitioner, practitionerRole }) => {
                return (
                    <>
                        <PractitionerHeader practitioner={practitioner} />
                        <BasePageContent>
                            <Routes>
                                <Route
                                    path="/"
                                    element={
                                        <>
                                            <Outlet />
                                        </>
                                    }
                                >
                                    <Route
                                        path="/"
                                        element={
                                            <PractitionerOverview
                                                practitioner={practitioner}
                                                practitionerRole={practitionerRole}
                                                reload={manager.reload}
                                            />
                                        }
                                    />
                                    <Route
                                        path="/scheduling"
                                        element={
                                            <ScheduleCalendar practitionerRole={practitionerRole} />
                                        }
                                    />
                                    <Route
                                        path="/availability"
                                        element={
                                            <Availability
                                                practitionerRole={practitionerRole}
                                                onSave={(updatedPR: WithId<PractitionerRole>) => {
                                                    navigate(
                                                        `/practitioners/${practitioner.id}/scheduling`,
                                                    );
                                                    manager.set({
                                                        practitioner,
                                                        practitionerRole: updatedPR,
                                                    });
                                                }}
                                            />
                                        }
                                    />
                                </Route>
                            </Routes>
                        </BasePageContent>
                    </>
                );
            }}
        </RenderRemoteData>
    );
};
