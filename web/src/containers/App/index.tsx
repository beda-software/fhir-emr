import { t, Trans } from '@lingui/macro';
import { User } from '@sentry/types';
import { Typography, Button } from 'antd';
import queryString from 'query-string';
import { useEffect } from 'react';
import { Route, unstable_HistoryRouter as HistoryRouter, Routes, Navigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';
import { useService } from 'aidbox-react/lib/hooks/service';
import { isSuccess, success } from 'aidbox-react/lib/libs/remoteData';
import { resetInstanceToken, setInstanceToken } from 'aidbox-react/lib/services/instance';
import { extractErrorCode } from 'aidbox-react/lib/utils/error';

import { EncounterList } from 'src/containers/EncounterList';
import { PatientDetails } from 'src/containers/PatientDetails';
import { PatientList } from 'src/containers/PatientList';
import { PractitionerList } from 'src/containers/PractitionerList';
import { QuestionnaireBuilder } from 'src/containers/QuestionnaireBuilder';
import { QuestionnaireList } from 'src/containers/QuestionnaireList';
import { LogoImage } from 'src/images/LogoImage';
import { getAuthorizeUrl, getToken, getUserInfo, OAuthState } from 'src/services/auth';
import { parseOAuthState, setToken } from 'src/services/auth';
import { history } from 'src/services/history';

import { EncounterDetails } from '../EncounterDetails';
import { EncounterQR } from '../EncounterQR';
import s from './App.module.scss';

export function App() {
    const [userResponse] = useService(async () => {
        const appToken = getToken();
        if (!appToken) {
            return success(null);
        }

        setInstanceToken({ access_token: appToken, token_type: 'Bearer' });

        const response = await getUserInfo();

        if (isSuccess(response)) {
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
            <Route path="/signin" element={<Signin />} />
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
            <Routes>
                <Route path="/patients" element={<PatientList />} />
                <Route path="/encounters" element={<EncounterList />} />
                <Route path="/patients/:id/*" element={<PatientDetails />} />
                <Route path="/documents/:id/edit" element={<div>documents/:id/edit</div>} />
                <Route
                    path="/encounters/:encounterId/qr/:questionnaireId"
                    element={<EncounterQR />}
                />
                <Route
                    path="/practitioners"
                    element={
                        <div className={s.sectionContainer}>
                            <PractitionerList />
                        </div>
                    }
                />
                <Route path="/questionnaires" element={<QuestionnaireList />} />
                <Route path="/questionnaires/builder" element={<QuestionnaireBuilder />} />
                <Route path="/questionnaires/:id/edit" element={<QuestionnaireBuilder />} />
                <Route path="/questionnaires/:id" element={<div>questionnaires/:id</div>} />
                <Route path="*" element={<Navigate to="/encounters" />} />
            </Routes>
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
            <RenderRemoteData remoteData={userResponse}>
                {(data) => <HistoryRouter history={history}>{renderRoutes(data)}</HistoryRouter>}
            </RenderRemoteData>
        </div>
    );
}

function authorize(state?: OAuthState) {
    window.location.href = getAuthorizeUrl(state);
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

export function Signin() {
    return (
        <div className={s.container}>
            <header className={s.header}>
                <div>
                    <LogoImage inverse />
                </div>
                <Typography.Title style={{ color: '#FFF' }}>{t`Welcome`}</Typography.Title>
                <Button type="primary" style={{ marginTop: 15 }} onClick={() => authorize()}>
                    {t`Log in`}
                </Button>
            </header>
        </div>
    );
}
