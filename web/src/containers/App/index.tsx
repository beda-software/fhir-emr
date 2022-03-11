import { t } from '@lingui/macro';
import { Typography, Button } from 'antd';
import queryString from 'query-string';
import { useEffect } from 'react';
import { Route, Routes, Navigate, BrowserRouter } from 'react-router-dom';

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

    return (
        <BrowserRouter>
            <RenderRemoteData remoteData={userResponse}>
                {(user) => {
                    if (user) {
                        return (
                            <Routes>
                                <Route path="*" element={<Navigate to="/encounters" />} />
                                <Route path="/patients" element={<PatientList />} />
                                <Route path="/encounters" element={<EncounterList />} />
                                <Route path="/patients/:id" element={<PatientDetails />} />
                                <Route
                                    path="/patients/:id/encounters/*"
                                    element={<PatientDetails />}
                                />
                                <Route
                                    path="/patients/:id/documents/*"
                                    element={<PatientDetails />}
                                />
                                <Route
                                    path="/documents/:id/edit/*"
                                    element={<div>documents/:id/edit</div>}
                                />
                                <Route
                                    path="/encounters/:encounterId"
                                    element={<EncounterDetails />}
                                />
                                <Route
                                    path="/encounters/:encounterId/qr/:questionnaireId"
                                    element={<EncounterQR />}
                                />
                                <Route path="/practitioners" element={<PractitionerList />} />
                                <Route path="/questionnaires" element={<QuestionnaireList />} />
                                <Route
                                    path="/questionnaires/builder/*"
                                    element={<QuestionnaireBuilder />}
                                />
                                <Route
                                    path="/questionnaires/:id/edit/*"
                                    element={(routeParams: {
                                        match: { params: { id: string | undefined } };
                                    }) => (
                                        <QuestionnaireBuilder
                                            questionnaireId={routeParams.match.params.id}
                                        />
                                    )}
                                />
                                <Route
                                    path="/questionnaires/:id/*"
                                    element={<div>questionnaires/:id</div>}
                                />
                            </Routes>
                        );
                    } else {
                        return (
                            <Routes>
                                <Route path="/auth/*" element={<Auth />} />
                                <Route
                                    path="/signin/*"
                                    element={
                                        <div className={s.container}>
                                            <header className={s.header}>
                                                <div>
                                                    <LogoImage inverse />
                                                </div>
                                                <Typography.Title
                                                    style={{ color: '#FFF' }}
                                                >{t`Welcome`}</Typography.Title>
                                                <Button
                                                    type="primary"
                                                    style={{ marginTop: 15 }}
                                                    onClick={() => authorize()}
                                                >
                                                    {t`Log in`}
                                                </Button>
                                            </header>
                                        </div>
                                    }
                                />
                                <Route path="/reset-password" element={<div>Reset password</div>} />
                                <Route
                                    path="/set-password/:code"
                                    element={<div>Set password</div>}
                                />
                                <Route
                                    path="about/*"
                                    element={
                                        <Navigate
                                            to="/signin"
                                            state={{ referrer: location.pathname }}
                                            replace
                                        />
                                    }
                                />
                                <Route path="*" element={<Navigate to="/signin" />} />
                            </Routes>
                        );
                    }
                }}
            </RenderRemoteData>
        </BrowserRouter>
    );
}

function authorize(state?: OAuthState) {
    window.location.href = getAuthorizeUrl(state);
}

export function Auth() {
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
