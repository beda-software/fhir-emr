import React from 'react';
import { Route, Switch, Router, Redirect } from 'react-router-dom';

import { Token } from 'aidbox-react/src/services/token';

import { getWelcomeString } from 'shared/src/utils/misc';

import { Button } from 'src/components/Button';
import { history } from 'src/services/history';

import s from './App.module.scss';
import logo from './images/logo.svg';

export function App() {
    const [appToken] = React.useState<Token | undefined>('mocktocken');

    const renderAnonymousRoutes = () => (
        <Switch>
            <Route path="/signin" exact>
                <div className={s.container}>
                    <header className={s.header}>
                        <img src={logo} className={s.logo} alt="logo" />
                        <p>{getWelcomeString('World')}</p>
                        <Button variant="primary" style={{ marginTop: 15 }}>
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
                <Redirect to={referrer !== '/' ? referrer : '/app'} />
            </Switch>
        );
    };

    const renderRoutes = () => {
        if (appToken) {
            return renderAuthenticatedRoutes();
        }

        return renderAnonymousRoutes();
    };

    return (
        <Router history={history}>
            <Switch>{renderRoutes()}</Switch>
        </Router>
    );
}
