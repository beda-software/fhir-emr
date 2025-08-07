import queryString from 'query-string';
import { ReactElement, useContext, useEffect } from 'react';
import { BrowserRouter, Routes, Navigate, useLocation, Route } from 'react-router-dom';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';
import { useService } from 'aidbox-react/lib/hooks/service';

import { User } from '@beda.software/aidbox-types';
import { RemoteDataResult, success } from '@beda.software/remote-data';

import { BaseLayout } from 'src/components/BaseLayout';
import { MenuLayout } from 'src/components/BaseLayout/Sidebar/SidebarTop/context';
import { Spinner } from 'src/components/Spinner';
import { PublicAppointment } from 'src/containers/Appointment/PublicAppointment';
import { getToken, parseOAuthState, setToken } from 'src/services/auth';

import { DefaultUserWithNoRoles } from '../App/DefaultUserWithNoRoles';
import { restoreUserSession } from '../App/utils';
import { DocumentPrint } from '../PatientDetails/DocumentPrint';

interface EMRProps {
    authenticatedRoutes?: ReactElement;
    anonymousRoutes?: ReactElement;
    populateUserInfoSharedState?: () => Promise<RemoteDataResult<User>>;
    UserWithNoRolesComponent?: () => ReactElement;
}

export function EMR(props: EMRProps) {
    const { authenticatedRoutes, anonymousRoutes, populateUserInfoSharedState, UserWithNoRolesComponent } = props;
    const menuLayout = useContext(MenuLayout);
    const [userResponse] = useService(async () => {
        const appToken = getToken();
        return appToken ? restoreUserSession(appToken, populateUserInfoSharedState) : success(null);
    });

    const renderRoutes = (user: User | null) => {
        if (user) {
            if ((user.role?.length ?? 0) === 0) {
                const UserWithNoRoles = UserWithNoRolesComponent ?? DefaultUserWithNoRoles;

                return <UserWithNoRoles />;
            }

            const layout = menuLayout();
            const defaultRoute = layout[0]?.path ?? '/encounters';
            return <AuthenticatedUserEMR defaultRoute={defaultRoute} extra={authenticatedRoutes} />;
        }

        return <AnonymousUserEMR extra={anonymousRoutes} />;
    };

    return (
        <div data-testid="emr-container">
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

function AnonymousUserEMR({ extra }: { extra?: ReactElement }) {
    return (
        <Routes>
            {extra}
            <Route path="/auth" element={<Auth />} />
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

interface RouteProps {
    defaultRoute: string;
    extra?: ReactElement;
}

function AuthenticatedUserEMR({ defaultRoute, extra }: RouteProps) {
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
                            <Route path="*" element={<Navigate to={defaultRoute} />} />
                        </Routes>
                    </BaseLayout>
                }
            />
        </Routes>
    );
}
