import { useParams, Outlet, Route, Routes } from 'react-router-dom';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';

import { BasePageContent } from 'src/components/BaseLayout';
import { PatientEncounter } from 'src/components/PatientEncounter';
import { Spinner } from 'src/components/Spinner';
import { Role, selectCurrentUserRole } from 'src/utils/role';

import { EncounterDetails } from '../EncounterDetails';
import { usePatientResource } from './hooks';
import { PatientDocument } from './PatientDocument';
import { PatientDocumentDetails } from './PatientDocumentDetails';
import { PatientDocuments } from './PatientDocuments';
import { PatientHeader, PatientHeaderContextProvider } from './PatientHeader';
import { PatientOverview } from './PatientOverview';
import { PatientWearables } from './PatientWearables';

export const PatientDetails = () => {
    const params = useParams<{ id: string }>();

    const [patientResponse, manager] = usePatientResource({ id: params.id! });

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
                                        element={
                                            <PatientOverview
                                                patient={patient}
                                                reload={manager.softReloadAsync}
                                            />
                                        }
                                    />
                                    <Route
                                        path="/encounters"
                                        element={<PatientEncounter patient={patient} />}
                                    />
                                    <Route
                                        path="/encounters/:encounterId"
                                        element={<EncounterDetails patient={patient} />}
                                    />
                                    <Route
                                        path="/encounters/:encounterId/new/:questionnaireId"
                                        element={<PatientDocument patient={patient} />}
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
                                        element={<PatientDocument patient={patient} />}
                                    />
                                    <Route
                                        path="/documents/:qrId/*"
                                        element={<PatientDocumentDetails patient={patient} />}
                                    />
                                    {selectCurrentUserRole({
                                        [Role.Admin]: null,
                                        [Role.Patient]: (
                                            <Route
                                                path="/wearables"
                                                element={<PatientWearables />}
                                            />
                                        ),
                                    })}
                                </Route>
                            </Routes>
                        </BasePageContent>
                    </PatientHeaderContextProvider>
                );
            }}
        </RenderRemoteData>
    );
};
