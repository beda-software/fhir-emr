import { CarePlan, Patient } from 'fhir/r4b';
import { useMemo } from 'react';
import { useParams, Outlet, Route, Routes } from 'react-router-dom';

import { RenderRemoteData } from '@beda.software/fhir-react';
import { isSuccess } from '@beda.software/remote-data';

import { PageContainer } from 'src/components/BaseLayout/PageContainer';
import { RouteItem } from 'src/components/BaseLayout/Sidebar/SidebarTop';
import { PatientEncounter } from 'src/components/PatientEncounter';
import { Spinner } from 'src/components/Spinner';
import { PatientReloadProvider } from 'src/containers/PatientDetails/Dashboard/contexts';
import { sharedAuthorizedPractitionerRoles } from 'src/sharedState';
import { renderHumanName } from 'src/utils';
import { matchCurrentUserRole, selectCurrentUserRoleResource, Role } from 'src/utils/role';

import { usePatientResource } from './hooks';
import { PatientApps } from './PatientApps';
import { PatientDetailsTabs } from './PatientDetailsTabs';
import { PatientDocument } from './PatientDocument';
import { PatientDocumentDetails } from './PatientDocumentDetails';
import { PatientDocuments } from './PatientDocuments';
import { PatientOrders } from './PatientOrders';
import { PatientOverview } from './PatientOverviewDynamic';
import { PatientResources } from './PatientResources';
import { PatientWearables } from './PatientWearables';
import { EncounterDetails } from '../EncounterDetails';

export interface PatientDetailsEmbeddedPageDefinition extends RouteItem {
    routes: Array<ReturnType<typeof Route>>;
}

export interface PatientDetailsProps {
    embeddedPages?: (patient: Patient, carePlans: CarePlan[]) => PatientDetailsEmbeddedPageDefinition[];
    isDefaultRoutesDisabled?: boolean;
}

export const PatientDetails = (props: PatientDetailsProps) => {
    const params = useParams<{ id: string }>();
    const { isDefaultRoutesDisabled } = props;

    const [patientResponse, manager] = usePatientResource({ id: params.id! });
    const author = selectCurrentUserRoleResource();
    const embeddedPages = useMemo(() => {
        if (isSuccess(patientResponse)) {
            return props.embeddedPages?.(patientResponse.data.patient, patientResponse.data.carePlans);
        }
    }, [patientResponse]);

    return (
        <RenderRemoteData remoteData={patientResponse} renderLoading={Spinner}>
            {({ patient }) => {
                return (
                    <PatientReloadProvider reload={manager.softReloadAsync}>
                        <PageContainer
                            title={renderHumanName(patient.name?.[0])}
                            layoutVariant="with-tabs"
                            headerContent={
                                <PatientDetailsTabs
                                    extraMenuItems={embeddedPages}
                                    isDefaultRoutesDisabled={isDefaultRoutesDisabled}
                                />
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
                                    {!props.isDefaultRoutesDisabled && (
                                        <>
                                            <Route path="/" element={<PatientOverview patient={patient} />} />
                                            <Route
                                                path="/encounters"
                                                element={
                                                    <PatientEncounter
                                                        patient={patient}
                                                        searchParams={matchCurrentUserRole({
                                                            [Role.Admin]: () => {
                                                                return {};
                                                            },
                                                            [Role.Practitioner]: (practitioner) => {
                                                                return {
                                                                    participant: (
                                                                        sharedAuthorizedPractitionerRoles.getSharedState() ||
                                                                        []
                                                                    )
                                                                        .map((pr) => `PractitionerRole/${pr.id}`)
                                                                        .join(','),
                                                                };
                                                            },
                                                            [Role.Patient]: () => {
                                                                return {};
                                                            },
                                                            [Role.Receptionist]: () => {
                                                                return {};
                                                            },
                                                        })}
                                                    />
                                                }
                                            />
                                            <Route
                                                path="/encounters/:encounterId"
                                                element={<EncounterDetails patient={patient} />}
                                            />
                                            <Route
                                                path="/encounters/:encounterId/new/:questionnaireId"
                                                element={
                                                    <PatientDocument
                                                        patient={patient}
                                                        author={author}
                                                        autosave={true}
                                                    />
                                                }
                                            />
                                            <Route
                                                path="/encounters/:encounterId/:qrId/*"
                                                element={<PatientDocumentDetails patient={patient} />}
                                            />
                                            <Route path="/documents" element={<PatientDocuments patient={patient} />} />
                                            <Route
                                                path="/documents/new/:questionnaireId"
                                                element={
                                                    <PatientDocument
                                                        patient={patient}
                                                        author={author}
                                                        autosave={true}
                                                    />
                                                }
                                            />
                                            <Route
                                                path="/documents/:qrId/*"
                                                element={<PatientDocumentDetails patient={patient} />}
                                            />
                                            <Route path="/wearables" element={<PatientWearables patient={patient} />} />
                                            <Route
                                                path="/resources/:type"
                                                element={<PatientResources patient={patient} />}
                                            />
                                            <Route path="/resources" element={<PatientResources patient={patient} />} />
                                            <Route path="/apps" element={<PatientApps patient={patient} />} />
                                            <Route path="/orders" element={<PatientOrders patient={patient} />} />
                                        </>
                                    )}
                                    {embeddedPages?.flatMap(({ routes }) => routes)}
                                </Route>
                            </Routes>
                        </PageContainer>
                    </PatientReloadProvider>
                );
            }}
        </RenderRemoteData>
    );
};
