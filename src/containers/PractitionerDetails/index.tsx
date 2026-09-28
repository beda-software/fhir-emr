import { HealthcareService, Practitioner, PractitionerRole } from 'fhir/r4b';
import { Outlet, Route, Routes, useNavigate, useParams } from 'react-router-dom';

import { RenderRemoteData, WithId, extractBundleResources, useService } from '@beda.software/fhir-react';
import { mapSuccess } from '@beda.software/remote-data';

import { PageContainer } from 'src/components/BaseLayout/PageContainer';
import { Spinner } from 'src/components/Spinner';
import { getFHIRResources } from 'src/services/fhir';
import { renderHumanName } from 'src/utils';

import { PractitionerDetailsTabs } from './PractitionerDetailsTabs';
import { PractitionerOverview } from './PractitionerOverview';
import { Availability } from '../Scheduling/Availability';
import { ScheduleCalendar } from '../Scheduling/ScheduleCalendar';

export const PractitionerDetails = () => {
    const params = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [response, manager] = useService(async () => {
        return mapSuccess(
            await getFHIRResources<Practitioner | PractitionerRole | HealthcareService>('Practitioner', {
                _id: params.id,
                _revinclude: ['PractitionerRole:practitioner'],
                _include: ['PractitionerRole:service:HealthcareService'],
            }),
            (bundle) => {
                const resources = extractBundleResources(bundle);

                return {
                    practitioner: resources.Practitioner[0]!,
                    practitionerRole: resources.PractitionerRole[0],
                    healthcareServices: resources.HealthcareService,
                };
            },
        );
    });

    return (
        <RenderRemoteData remoteData={response} renderLoading={Spinner}>
            {({ practitioner, practitionerRole, healthcareServices }) => {
                return (
                    <PageContainer
                        layoutVariant="with-tabs"
                        title={renderHumanName(practitioner.name?.[0])}
                        headerContent={
                            <PractitionerDetailsTabs practitioner={practitioner} practitionerRole={practitionerRole} />
                        }
                    >
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
                                            healthcareServices={healthcareServices}
                                            reload={manager.reload}
                                        />
                                    }
                                />
                                {practitionerRole ? (
                                    <>
                                        <Route
                                            path="/scheduling"
                                            element={<ScheduleCalendar practitionerRole={practitionerRole} />}
                                        />
                                        <Route
                                            path="/availability"
                                            element={
                                                <Availability
                                                    practitionerRole={practitionerRole}
                                                    onSave={(updatedPR: WithId<PractitionerRole>) => {
                                                        navigate(`/practitioners/${practitioner.id}/scheduling`);
                                                        manager.set({
                                                            practitioner,
                                                            practitionerRole: updatedPR,
                                                            healthcareServices,
                                                        });
                                                    }}
                                                />
                                            }
                                        />
                                    </>
                                ) : null}
                            </Route>
                        </Routes>
                    </PageContainer>
                );
            }}
        </RenderRemoteData>
    );
};
