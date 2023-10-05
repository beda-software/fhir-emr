import { useParams, Outlet, Route, Routes } from 'react-router-dom';

import { RenderRemoteData } from 'fhir-react/lib/components/RenderRemoteData';

import { BasePageContent } from 'src/components/BaseLayout';
import { PatientEncounter } from 'src/components/PatientEncounter';
import { Spinner } from 'src/components/Spinner';
import { matchCurrentUserRole, selectCurrentUserRoleResource, Role } from 'src/utils/role';

import { usePatientResource } from './hooks';
import { PatientApps } from './PatientApps';
import { PatientDocument } from './PatientDocument';
import { PatientDocumentDetails } from './PatientDocumentDetails';
import { PatientDocuments } from './PatientDocuments';
import { PatientHeader, PatientHeaderContextProvider } from './PatientHeader';
import { PatientOverview } from './PatientOverview';
import { PatientResources } from './PatientResources';
import { PatientWearables } from './PatientWearables';
import { EncounterDetails } from '../EncounterDetails';

export const PatientDetails = () => {
    const params = useParams<{ id: string }>();

    const [patientResponse, manager] = usePatientResource({ id: params.id! });
    const author = selectCurrentUserRoleResource();

    return (
        <RenderRemoteData remoteData={patientResponse} renderLoading={Spinner}>
            {(patient) => {
                return (
                    <PatientHeaderContextProvider patient={patient}>
                        <PatientHeader />
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
                                        element={<PatientOverview patient={patient} reload={manager.softReloadAsync} />}
                                    />
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
                                    <Route path="/documents" element={<PatientDocuments patient={patient} />} />
                                    <Route
                                        path="/documents/new/:questionnaireId"
                                        element={<PatientDocument patient={patient} author={author} />}
                                    />
                                    <Route
                                        path="/documents/:qrId/*"
                                        element={<PatientDocumentDetails patient={patient} />}
                                    />
                                    <Route path="/wearables" element={<PatientWearables patient={patient} />} />
                                    <Route path="/resources/:type" element={<PatientResources patient={patient} />} />
                                    <Route path="/resources" element={<PatientResources patient={patient} />} />
                                    <Route path="/apps" element={<PatientApps patient={patient} />} />
                                </Route>
                            </Routes>
                        </BasePageContent>
                    </PatientHeaderContextProvider>
                );
            }}
        </RenderRemoteData>
    );
};
