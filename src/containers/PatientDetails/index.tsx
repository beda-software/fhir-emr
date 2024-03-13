import { Patient } from 'fhir/r4b';
import { useMemo } from 'react';
import { useParams, Outlet, Route, Routes } from 'react-router-dom';

import { RenderRemoteData } from '@beda.software/fhir-react';
import { isSuccess } from '@beda.software/remote-data';

import { BasePageContent } from 'src/components/BaseLayout';
import { RouteItem } from 'src/components/BaseLayout/Sidebar/SidebarTop';
import { PatientEncounter } from 'src/components/PatientEncounter';
import { Spinner } from 'src/components/Spinner';
import { PatientReloadProvider } from 'src/containers/PatientDetails/Dashboard/contexts';
import { matchCurrentUserRole, selectCurrentUserRoleResource, Role } from 'src/utils/role';

import { usePatientResource } from './hooks';
import { PatientApps } from './PatientApps';
import { PatientDocument } from './PatientDocument';
import { PatientDocumentDetails } from './PatientDocumentDetails';
import { PatientDocuments } from './PatientDocuments';
import { PatientHeader, PatientHeaderContextProvider } from './PatientHeader';
import { PatientOrders } from './PatientOrders';
import { PatientOverview } from './PatientOverviewDynamic';
import { PatientResources } from './PatientResources';
import { PatientWearables } from './PatientWearables';
import { EncounterDetails } from '../EncounterDetails';

export interface PatientDetailsEmbeddedPageDefinition extends RouteItem {
    routes: Array<ReturnType<typeof Route>>;
}

export interface PatientDetailsProps {
    embeddedPages?: (patient: Patient) => PatientDetailsEmbeddedPageDefinition[];
    isDefaultRoutesDisabled?: boolean;
}

export const PatientDetails = (props: PatientDetailsProps) => {
    const params = useParams<{ id: string }>();

    const [patientResponse, manager] = usePatientResource({ id: params.id! });
    const author = selectCurrentUserRoleResource();
    const embeddedPages = useMemo(() => {
        if (isSuccess(patientResponse)) {
            return props.embeddedPages?.(patientResponse.data);
        }
    }, [patientResponse]);

    return (
        <RenderRemoteData remoteData={patientResponse} renderLoading={Spinner}>
            {(patient) => {
                return (
                    <PatientReloadProvider reload={manager.softReloadAsync}>
                        <PatientHeaderContextProvider patient={patient}>
                            <PatientHeader
                                extraMenuItems={embeddedPages}
                                isDefaultRoutesDisabled={props.isDefaultRoutesDisabled}
                            />
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
                                                                    return { participant: practitioner.id };
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
                                                    element={<PatientDocument patient={patient} author={author} />}
                                                />
                                                <Route
                                                    path="/encounters/:encounterId/:qrId/*"
                                                    element={<PatientDocumentDetails patient={patient} />}
                                                />
                                                <Route
                                                    path="/documents"
                                                    element={<PatientDocuments patient={patient} />}
                                                />
                                                <Route
                                                    path="/documents/new/:questionnaireId"
                                                    element={<PatientDocument patient={patient} author={author} />}
                                                />
                                                <Route
                                                    path="/documents/:qrId/*"
                                                    element={<PatientDocumentDetails patient={patient} />}
                                                />
                                                <Route
                                                    path="/wearables"
                                                    element={<PatientWearables patient={patient} />}
                                                />
                                                <Route
                                                    path="/resources/:type"
                                                    element={<PatientResources patient={patient} />}
                                                />
                                                <Route
                                                    path="/resources"
                                                    element={<PatientResources patient={patient} />}
                                                />
                                                <Route path="/apps" element={<PatientApps patient={patient} />} />
                                                <Route path="/orders" element={<PatientOrders patient={patient} />} />
                                            </>
                                        )}
                                        {embeddedPages?.flatMap(({ routes }) => routes)}
                                    </Route>
                                </Routes>
                            </BasePageContent>
                        </PatientHeaderContextProvider>
                    </PatientReloadProvider>
                );
            }}
        </RenderRemoteData>
    );
};
