import { t } from '@lingui/macro';
import queryString from 'query-string';
import { ReactElement, useContext, useEffect, useRef } from 'react';
import { Route, BrowserRouter, Routes, Navigate, useLocation, useNavigate } from 'react-router-dom';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';
import { useService } from 'aidbox-react/lib/hooks/service';
import { success } from 'aidbox-react/lib/libs/remoteData';

import { User } from '@beda.software/aidbox-types';

import { AnonymousLayout, BaseLayout } from 'src/components/BaseLayout';
import { MenuLayout } from 'src/components/BaseLayout/Sidebar/SidebarTop/context';
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

import { restoreUserSession } from './utils';
import { AidboxFormsBuilder } from '../AidboxFormsBuilder';
import { HealthcareServiceList } from '../HealthcareServiceList';
import { InvoiceDetails } from '../InvoiceDetails';
import { InvoiceList } from '../InvoiceList';
import { MedicationManagement } from '../MedicationManagement';
import { NotificationPage } from '../NotificationPage';
import { OrganizationScheduling } from '../OrganizationScheduling';
import { DocumentPrint } from '../PatientDetails/DocumentPrint';
import { Prescriptions } from '../Prescriptions';
import { SetPassword } from '../SetPassword';

interface AppProps {
    authenticatedRoutes?: ReactElement;
    anonymousRoutes?: ReactElement;
    populateUserInfoSharedState?: (user: User) => Promise<void>;
}

export function App({ authenticatedRoutes, anonymousRoutes, populateUserInfoSharedState }: AppProps) {
    const menuLayout = useContext(MenuLayout);
    const [userResponse] = useService(async () => {
        const appToken = getToken();
        return appToken ? restoreUserSession(appToken, populateUserInfoSharedState) : success(null);
    });

    const renderRoutes = (user: User | null) => {
        if (user) {
            const layout = menuLayout();
            const defaultRoute = layout[0]?.path ?? '/encounters';
            return <AuthenticatedUserApp defaultRoute={defaultRoute} extra={authenticatedRoutes} />;
        }

        return <AnonymousUserApp extra={anonymousRoutes} />;
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

function AnonymousUserApp({ extra }: { extra?: ReactElement }) {
    const location = useLocation();
    const originPathRef = useRef(location.pathname);
    const navigate = useNavigate();

    return (
        <Routes>
            {extra}
            <Route path="/auth" element={<Auth />} />
            <Route path="/signin" element={<SignIn originPathName={originPathRef.current} />} />
            <Route path="/reset-password/:code" element={<SetPassword />} />
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
                        <PatientQuestionnaire onSuccess={() => navigate('thanks')} />
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
            <Route
                path="/thanks"
                element={
                    <NotificationPage
                        title={t`Thank you!`}
                        text={t`Thank you for filling out the questionnaire. Now you can close this page.`}
                    />
                }
            />
        </Routes>
    );
}

interface RouteProps {
    defaultRoute: string;
    extra?: ReactElement;
}

function AuthenticatedUserApp({ defaultRoute, extra }: RouteProps) {
    return (
        <Routes>
            <Route path={`/print-patient-document/:id/:qrId`} element={<DocumentPrint />} />
            <Route path="/appointment/book" element={<PublicAppointment />} />
            <Route
                path="*"
                element={
                    <BaseLayout>
                        <Routes>
                            {extra}
                            <Route path="/encounters" element={<EncounterList />} />
                            <Route path="/scheduling" element={<OrganizationScheduling />} />
                            <Route path="/medications" element={<MedicationManagement />} />
                            <Route path="/prescriptions" element={<Prescriptions />} />
                            <Route path="/invoices" element={<InvoiceList />} />
                            <Route path="/invoices/:id" element={<InvoiceDetails />} />
                            <Route path="/patients" element={<PatientList />} />
                            <Route path="/patients/:id/*" element={<PatientDetails />} />
                            <Route path="/questionnaire" element={<PatientQuestionnaire />} />
                            <Route path="/documents/:id/edit" element={<div>documents/:id/edit</div>} />
                            <Route path="/encounters/:encounterId/video" element={<VideoCall />} />
                            <Route path="/practitioners" element={<PractitionerList />} />
                            <Route path="/practitioners/:id/*" element={<PractitionerDetails />} />
                            <Route path="/questionnaires" element={<QuestionnaireList />} />
                            <Route path="/questionnaires/builder" element={<QuestionnaireBuilder />} />
                            <Route path="/questionnaires/:id/edit" element={<QuestionnaireBuilder />} />
                            <Route
                                path="/questionnaires/:id/aidbox-forms-builder/edit"
                                element={<AidboxFormsBuilder />}
                            />
                            <Route path="/questionnaires/:id" element={<div>questionnaires/:id</div>} />
                            <Route path="/healthcare-services" element={<HealthcareServiceList />} />
                            <Route path="*" element={<Navigate to={defaultRoute} />} />
                        </Routes>
                    </BaseLayout>
                }
            />
        </Routes>
    );
}
