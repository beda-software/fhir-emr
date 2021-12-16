import { User } from '@sentry/types';
import queryString from 'query-string';
import { useEffect } from 'react';
import { Route, Switch, Router, Redirect } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';
import { useService } from 'aidbox-react/lib/hooks/service';
import { isSuccess, success } from 'aidbox-react/lib/libs/remoteData';
import { resetInstanceToken, setInstanceToken } from 'aidbox-react/lib/services/instance';
import { extractErrorCode } from 'aidbox-react/lib/utils/error';

import { getWelcomeString } from 'shared/src/utils/misc';

import { Button } from 'src/components/Button';
import { getAuthorizeUrl, getToken, getUserInfo, OAuthState } from 'src/services/auth';
import { parseOAuthState, setToken } from 'src/services/auth';
import { history } from 'src/services/history';

import s from './App.module.scss';
import logo from './images/logo.svg';

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
                        <img src={logo} className={s.logo} alt="logo" />
                        <p>{getWelcomeString('World')}</p>
                        <Button
                            variant="primary"
                            style={{ marginTop: 15 }}
                            onClick={() => authorize()}
                        >
                            Sign in
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
                <Route path="/app" render={() => <div>App</div>} />
                <Route path="/patients" render={() => <div>Patients</div>} />
                <Route path="/encounters" render={() => <div>Encounters</div>} />
                <Route path="/patient/:id" render={() => <div>patient/:id</div>} />
                <Route
                    path="/patient/:id/encounters"
                    render={() => <div>patient/:id/encounters</div>}
                />
                <Route
                    path="/patient/:id/documents"
                    render={() => <div>patient/:id/documents</div>}
                />
                <Route path="/documents/:id/edit" render={() => <div>documents/:id/edit</div>} />
                <Route path="/encounters/:id" render={() => <div>Encounters/:id</div>} />

                <Route path="/practitioners" render={() => <div>practitioners</div>} />
                <Route path="/questionnaires" render={() => <div>questionnaires</div>} />
                <Route path="/questionnaires/:id" render={() => <div>questionnaires/:id</div>} />
                <Redirect to={referrer && referrer !== '/' ? referrer : '/app'} />
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
