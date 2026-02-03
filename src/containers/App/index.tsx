import { t } from '@lingui/macro';
import { ReactElement } from 'react';
import { Route, useNavigate } from 'react-router-dom';

import { AnonymousLayout } from 'src/components/BaseLayout';
import { defaultFooterLayout } from 'src/components/BaseLayout/Footer/context';
import { defaultMenuLayout } from 'src/components/BaseLayout/Sidebar/SidebarTop/context';
import { PublicAppointment } from 'src/containers/Appointment/PublicAppointment';
import { EncounterList } from 'src/containers/EncounterList';
import { MagicSearchPage } from 'src/containers/MagicSearchPage';
import { PatientDetails } from 'src/containers/PatientDetails';
import { NewPatientDetails } from 'src/containers/PatientDetails/new';
import { PatientList } from 'src/containers/PatientList';
import { PatientQuestionnaire } from 'src/containers/PatientQuestionnaire';
import { PractitionerDetails } from 'src/containers/PractitionerDetails';
import { PractitionerList } from 'src/containers/PractitionerList';
import { QuestionnaireBuilder } from 'src/containers/QuestionnaireBuilder';
import { QuestionnaireList } from 'src/containers/QuestionnaireList';
import { SignIn } from 'src/containers/SignIn';
import { VideoCall } from 'src/containers/VideoCall';

import { AidboxFormsBuilder } from '../AidboxFormsBuilder';
import { EMR } from '../EMR';
import { HealthcareServiceList } from '../HealthcareServiceList';
import { InvoiceDetails } from '../InvoiceDetails';
import { InvoiceList } from '../InvoiceList';
import { MedicationManagement } from '../MedicationManagement';
import { MedicationManagementDetail } from '../MedicationManagementDetail';
import { NotificationPage } from '../NotificationPage';
import { OrganizationScheduling } from '../OrganizationScheduling';
import { Prescriptions } from '../Prescriptions';
import { SetPassword } from '../SetPassword';

interface AppProps {
    authenticatedRoutes?: ReactElement;
    anonymousRoutes?: ReactElement;
    populateUserInfoSharedState?: () => Promise<any>;
    UserWithNoRolesComponent?: () => ReactElement;
}

export function App(props: AppProps) {
    const { authenticatedRoutes, anonymousRoutes, populateUserInfoSharedState, UserWithNoRolesComponent } = props;
    const navigate = useNavigate();

    // Define the default authenticated routes
    const defaultAuthenticatedRoutes = (
        <>
            <Route path="/encounters" element={<EncounterList />} />
            <Route path="/scheduling" element={<OrganizationScheduling />} />
            <Route path="/medications" element={<MedicationManagement />} />
            <Route path="/medications/:id/*" element={<MedicationManagementDetail />} />
            <Route path="/prescriptions" element={<Prescriptions />} />
            <Route path="/invoices" element={<InvoiceList />} />
            <Route path="/invoices/:id" element={<InvoiceDetails />} />
            <Route path="/patients" element={<PatientList />} />
            <Route path="/patients/:id/*" element={<PatientDetails />} />
            <Route path="/patients2/:id/*" element={<NewPatientDetails />} />
            <Route path="/questionnaire" element={<PatientQuestionnaire />} />
            <Route path="/documents/:id/edit" element={<div>documents/:id/edit</div>} />
            <Route path="/encounters/:encounterId/video" element={<VideoCall />} />
            <Route path="/practitioners" element={<PractitionerList />} />
            <Route path="/practitioners/:id/*" element={<PractitionerDetails />} />
            <Route path="/questionnaires" element={<QuestionnaireList />} />
            <Route path="/questionnaires/builder" element={<QuestionnaireBuilder />} />
            <Route path="/questionnaires/:id/edit" element={<QuestionnaireBuilder />} />
            <Route path="/questionnaires/:id/aidbox-forms-builder/edit" element={<AidboxFormsBuilder />} />
            <Route path="/questionnaires/:id" element={<div>questionnaires/:id</div>} />
            <Route path="/magic-search" element={<MagicSearchPage />} />
            <Route path="/healthcare-services" element={<HealthcareServiceList />} />
        </>
    );

    // Define the default anonymous routes
    const defaultAnonymousRoutes = (
        <>
            <Route path="/signin" element={<SignIn originPathName={window.location.pathname} />} />
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
                path="/thanks"
                element={
                    <NotificationPage
                        title={t`Thank you!`}
                        text={t`Thank you for filling out the questionnaire. Now you can close this page.`}
                    />
                }
            />
        </>
    );

    return (
        <div data-testid="app-container">
            <EMR
                authenticatedRoutes={authenticatedRoutes ? authenticatedRoutes : defaultAuthenticatedRoutes}
                anonymousRoutes={anonymousRoutes ? anonymousRoutes : defaultAnonymousRoutes}
                populateUserInfoSharedState={populateUserInfoSharedState}
                UserWithNoRolesComponent={UserWithNoRolesComponent}
                menuLayout={defaultMenuLayout}
                footer={defaultFooterLayout}
            />
        </div>
    );
}
