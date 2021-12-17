import { User } from '@sentry/types';
import { Typography, Button } from 'antd';
import queryString from 'query-string';
import { useEffect } from 'react';
import { Route, Switch, Router, Redirect } from 'react-router-dom';
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
import { QuestionnaireList } from 'src/containers/QuestionnaireList';
import { LogoImage } from 'src/images/LogoImage';
import { getAuthorizeUrl, getToken, getUserInfo, OAuthState } from 'src/services/auth';
import { parseOAuthState, setToken } from 'src/services/auth';
import { history } from 'src/services/history';

import { EncounterDetails } from '../EncounterDetails';
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
        <Switch>
            <Route path="/auth" exact>
                <Auth />
            </Route>
            <Route path="/signin" exact>
                <div className={s.container}>
                    <header className={s.header}>
                        <div>
                            <LogoImage inverse />
                        </div>
                        <Typography.Title style={{ color: '#FFF' }}>
                            Добро пожаловать!
                        </Typography.Title>
                        <Button
                            type="primary"
                            style={{ marginTop: 15 }}
                            onClick={() => authorize()}
                        >
                            Войти
                        </Button>
                    </header>
                </div>
            </Route>
            <Route path="/reset-password" exact render={() => <div>Reset password</div>} />
            <Route path="/set-password/:code" exact render={() => <div>Set password</div>} />
            <Redirect
                to={{
                    pathname: '/signin',
                    state: { referrer: history.location.pathname },
                }}
            />
        </Switch>
    );

    const renderAuthenticatedRoutes = () => {
        const referrer = history?.location?.state?.referrer;

        return (
            <Switch>
                <Route path="/patients" render={() => <PatientList />} exact />
                <Route path="/encounters" render={() => <EncounterList />} exact />
                <Route path="/patients/:id" render={() => <PatientDetails />} exact />
                <Route path="/patients/:id/encounters" render={() => <PatientDetails />} />
                <Route path="/patients/:id/documents" render={() => <PatientDetails />} />
                <Route path="/documents/:id/edit" render={() => <div>documents/:id/edit</div>} />
                <Route path="/encounters/:encounterId" render={() => <EncounterDetails />} exact />

                <Route path="/practitioners" render={() => <PractitionerList />} />
                <Route path="/questionnaires" render={() => <QuestionnaireList />} />
                <Route path="/questionnaires/:id" render={() => <div>questionnaires/:id</div>} />

                <Redirect to={referrer && referrer !== '/' ? referrer : '/patients'} />
            </Switch>
        );
    };

    const renderRoutes = (user: User | null) => {
        if (user) {
            return renderAuthenticatedRoutes();
        }

        return renderAnonymousRoutes();
    };

    return (
        <Router history={history}>
            <Switch>
                <RenderRemoteData remoteData={userResponse}>
                    {(data) => renderRoutes(data)}
                </RenderRemoteData>
            </Switch>
        </Router>
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
