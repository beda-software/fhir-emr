import { Trans } from '@lingui/macro';
import { User } from '@sentry/types';
import queryString from 'query-string';
import { useEffect } from 'react';
import { Route, unstable_HistoryRouter as HistoryRouter, Routes, Navigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';
import { useService } from 'aidbox-react/lib/hooks/service';
import { isSuccess, RemoteDataResult, success } from 'aidbox-react/lib/libs/remoteData';
import { getFHIRResource } from 'aidbox-react/lib/services/fhir';
import { resetInstanceToken, setInstanceToken } from 'aidbox-react/lib/services/instance';
import { extractErrorCode } from 'aidbox-react/lib/utils/error';

import { Practitioner } from 'shared/src/contrib/aidbox';

import { BaseLayout } from 'src/components/BaseLayout';
import { Spinner } from 'src/components/Spinner';
import { EncounterList } from 'src/containers/EncounterList';
import { EncounterQR } from 'src/containers/EncounterQR';
import { PatientDetails } from 'src/containers/PatientDetails';
import { PatientList } from 'src/containers/PatientList';
import { PractitionerList } from 'src/containers/PractitionerList';
import { QuestionnaireBuilder } from 'src/containers/QuestionnaireBuilder';
import { QuestionnaireList } from 'src/containers/QuestionnaireList';
import { VideoCall } from 'src/containers/VideoCall';
import { getToken, getUserInfo } from 'src/services/auth';
import { parseOAuthState, setToken } from 'src/services/auth';
import { history } from 'src/services/history';
import { sharedAuthorisedPractitioner } from 'src/sharedState';

import { PublicAppointment } from '../Appointment/PublicAppointment';
import { PatientQuestionnaire } from '../PatientQuestionnaire';
import { PractitionerDetails } from '../PractitionerDetails';
import { SignIn } from '../SignIn';

export function App() {
    const [userResponse] = useService(async () => {
        const appToken = getToken();
        if (!appToken) {
            return success(null);
        }

        setInstanceToken({ access_token: appToken, token_type: 'Bearer' });

        const response: RemoteDataResult = await getUserInfo();

        if (isSuccess(response)) {
            const practitionerId = response.data.role[0].links.practitioner.id;
            const practitionerResponse = await getFHIRResource<Practitioner>({
                resourceType: 'Practitioner',
                id: practitionerId,
            });
            if (isSuccess(practitionerResponse)) {
                sharedAuthorisedPractitioner.setSharedState(practitionerResponse.data);
            } else {
                console.error(practitionerResponse.error);
            }
        } else {
            if (extractErrorCode(response.error) !== 'network_error') {
                resetInstanceToken();

                return success(null);
            }
        }

        return response;
    });

    const renderAnonymousRoutes = () => (
        <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/signin" element={<SignIn />} />
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
            <Route path="/appointment/book" element={<PublicAppointment />} />
            <Route path="/questionnaire" element={<PatientQuestionnaire />} />
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

    const renderAuthenticatedRoutes = () => {
        return (
            <BaseLayout>
                <Routes>
                    <Route path="/patients" element={<PatientList />} />
                    <Route path="/encounters" element={<EncounterList />} />
                    <Route path="/appointment/book" element={<PublicAppointment />} />
                    <Route path="/questionnaire" element={<PatientQuestionnaire />} />
                    <Route path="/patients/:id/*" element={<PatientDetails />} />
                    <Route path="/documents/:id/edit" element={<div>documents/:id/edit</div>} />
                    <Route
                        path="/encounters/:encounterId/qr/:questionnaireId"
                        element={<EncounterQR />}
                    />
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
    };

    const renderRoutes = (user: User | null) => {
        if (user) {
            return renderAuthenticatedRoutes();
        }

        return renderAnonymousRoutes();
    };

    return (
        <div data-testid="app-container">
            <RenderRemoteData remoteData={userResponse} renderLoading={Spinner}>
                {(data) => <HistoryRouter history={history}>{renderRoutes(data)}</HistoryRouter>}
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
