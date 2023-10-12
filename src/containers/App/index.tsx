import { Trans } from '@lingui/macro';
import queryString from 'query-string';
import { useEffect, useRef } from 'react';
import { Route, BrowserRouter, Routes, Navigate, useLocation } from 'react-router-dom';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';
import { useService } from 'aidbox-react/lib/hooks/service';
import { success } from 'aidbox-react/lib/libs/remoteData';

import { User } from 'shared/src/contrib/aidbox';

import { AnonymousLayout, BaseLayout } from 'src/components/BaseLayout';
import { Spinner } from 'src/components/Spinner';
import { PublicAppointment } from 'src/containers/Appointment/PublicAppointment';
import { EncounterList } from 'src/containers/EncounterList';
import { PatientDetails } from 'src/containers/PatientDetails';
import { PatientList } from 'src/containers/PatientList';
import { PatientQuestionnaire } from 'src/containers/PatientQuestionnaire';
import { PractitionerDetails } from 'src/containers/PractitionerDetails';
import { PractitionerList } from 'src/containers/PractitionerList';
import { QuestionnaireBuilder } from 'src/containers/QuestionnaireBuilder';
import { QuestionnaireList } from 'src/containers/QuestionnaireList';
import { SignIn } from 'src/containers/SignIn';
import { VideoCall } from 'src/containers/VideoCall';
import { getToken, parseOAuthState, setToken } from 'src/services/auth';
import { sharedAuthorizedPatient } from 'src/sharedState';
import { Role, matchCurrentUserRole } from 'src/utils/role';

import { restoreUserSession } from './utils';
import { HealthcareServiceList } from '../HealthcareServiceList';
import { InvoiceDetails } from '../InvoiceDetails';
import { InvoiceList } from '../InvoiceList';
import { OrganizationScheduling } from '../OrganizationScheduling';

export function App() {
    const [userResponse] = useService(async () => {
        const appToken = getToken();
        return appToken ? restoreUserSession(appToken) : success(null);
    });

    const renderRoutes = (user: User | null) => {
        if (user) {
            return matchCurrentUserRole({
                [Role.Admin]: () => <AuthenticatedAdminUserApp />,
                [Role.Patient]: () => <AuthenticatedPatientUserApp />,
                [Role.Practitioner]: () => <AuthenticatedPractitionerUserApp />,
                [Role.Receptionist]: () => <AuthenticatedReceptionistUserApp />,
            });
        }

        return <AnonymousUserApp />;
    };

    return (
        <div data-testid="app-container">
            <RenderRemoteData remoteData={userResponse} renderLoading={Spinner}>
                {(user) => <BrowserRouter>{renderRoutes(user)}</BrowserRouter>}
            </RenderRemoteData>
        </div>
    );
}

export function Auth() {
    const location = useLocation();

    useEffect(() => {
        const queryParams = queryString.parse(location.hash);

        if (queryParams.access_token) {
            setToken(queryParams.access_token as string);
            const state = parseOAuthState(queryParams.state as string | undefined);

            window.location.href = state.nextUrl ?? '/';
        }
    }, [location.hash]);

    return null;
}

function AnonymousUserApp() {
    const location = useLocation();
    const originPathRef = useRef(location.pathname);

    return (
        <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/signin" element={<SignIn originPathName={originPathRef.current} />} />
            <Route
                path="/reset-password"
                element={
                    <div>
                        <Trans>Reset password</Trans>
                    </div>
                }
            />
            <Route
                path="/set-password/:code"
                element={
                    <div>
                        <Trans>Set password</Trans>
                    </div>
                }
            />
            <Route
                path="/appointment/book"
                element={
                    <AnonymousLayout>
                        <PublicAppointment />
                    </AnonymousLayout>
                }
            />
            <Route
                path="/questionnaire"
                element={
                    <AnonymousLayout>
                        <PatientQuestionnaire />
                    </AnonymousLayout>
                }
            />
            <Route
                path="*"
                element={
                    <>
                        <Navigate to="/signin" replace={true} />
                    </>
                }
            />
        </Routes>
    );
}

function AuthenticatedAdminUserApp() {
    return (
        <BaseLayout>
            <Routes>
                {/* TODO: in the current implementation admin will get all patients via /patients, but it's wrong */}
                <Route path="/patients" element={<PatientList />} />
                <Route path="/encounters" element={<EncounterList />} />
                <Route path="/invoices" element={<InvoiceList />} />
                <Route path="/invoices/:id" element={<InvoiceDetails />} />
                <Route path="/appointment/book" element={<PublicAppointment />} />
                <Route path="/questionnaire" element={<PatientQuestionnaire />} />
                <Route path="/patients/:id/*" element={<PatientDetails />} />
                <Route path="/documents/:id/edit" element={<div>documents/:id/edit</div>} />
                <Route path="/encounters/:encounterId/video" element={<VideoCall />} />
                <Route path="/practitioners" element={<PractitionerList />} />
                <Route path="/practitioners/:id/*" element={<PractitionerDetails />} />
                <Route path="/questionnaires" element={<QuestionnaireList />} />
                <Route path="/questionnaires/builder" element={<QuestionnaireBuilder />} />
                <Route path="/questionnaires/:id/edit" element={<QuestionnaireBuilder />} />
                <Route path="/questionnaires/:id" element={<div>questionnaires/:id</div>} />
                <Route path="/healthcare-services" element={<HealthcareServiceList />} />
                <Route path="*" element={<Navigate to="/encounters" />} />
            </Routes>
        </BaseLayout>
    );
}

function AuthenticatedPractitionerUserApp() {
    return (
        <BaseLayout>
            <Routes>
                <Route path="/patients" element={<PatientList />} />
                <Route path="/encounters" element={<EncounterList />} />
                <Route path="/appointment/book" element={<PublicAppointment />} />
                <Route path="/questionnaire" element={<PatientQuestionnaire />} />
                <Route path="/patients/:id/*" element={<PatientDetails />} />
                <Route path="/documents/:id/edit" element={<div>documents/:id/edit</div>} />
                <Route path="/encounters/:encounterId/video" element={<VideoCall />} />
                <Route path="/practitioners" element={<PractitionerList />} />
                <Route path="/practitioners/:id/*" element={<PractitionerDetails />} />
                <Route path="/questionnaires" element={<QuestionnaireList />} />
                <Route path="/questionnaires/builder" element={<QuestionnaireBuilder />} />
                <Route path="/questionnaires/:id/edit" element={<QuestionnaireBuilder />} />
                <Route path="/questionnaires/:id" element={<div>questionnaires/:id</div>} />
                <Route path="*" element={<Navigate to="/encounters" />} />
            </Routes>
        </BaseLayout>
    );
}

function AuthenticatedReceptionistUserApp() {
    return (
        <BaseLayout>
            <Routes>
                <Route path="/scheduling" element={<OrganizationScheduling />} />
                <Route path="/invoices" element={<InvoiceList />} />
                <Route path="/invoices/:id" element={<InvoiceDetails />} />
                <Route path="*" element={<Navigate to="/scheduling" />} />
            </Routes>
        </BaseLayout>
    );
}

function AuthenticatedPatientUserApp() {
    const [patient] = sharedAuthorizedPatient.useSharedState();

    return (
        <BaseLayout>
            <Routes>
                <Route path="/invoices" element={<InvoiceList />} />
                <Route path="/invoices/:id" element={<InvoiceDetails />} />
                <Route path={`/patients/:id/*`} element={<PatientDetails />} />
                <Route path="*" element={<Navigate to={`/patients/${patient!.id}`} />} />
            </Routes>
        </BaseLayout>
    );
}
