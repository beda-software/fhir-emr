import { t } from '@lingui/macro';
import { notification } from 'antd';
import { useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { isFailure } from '@beda.software/remote-data';

import { getSignInUrl, parseSignInLocationState, signinWithIdentityToken } from 'src/services/auth';

declare const AppleID: any;

interface AppleAuthenticationResponse {
    // 'user' information is only available the first time the user authorizes the app.
    // Consecutive authorization requests will have this field missing.
    // For more information:
    // https://developer.apple.com/documentation/sign_in_with_apple/sign_in_with_apple_js/configuring_your_webpage_for_sign_in_with_apple#3331292
    user?: {
        email: string;
        name: {
            firstName: string;
            lastName: string;
        };
    };
    authorization: {
        id_token: string;
    };
}

export function useSignInLocationState() {
    const location = useLocation();

    return parseSignInLocationState(location.state);
}

export function useSignIn(originPathName?: string) {
    return useCallback(async () => {
        try {
            const result = await getSignInUrl({ nextUrl: originPathName });

            if (isFailure(result)) {
                notification.error({ message: result.error.message });

                return;
            }

            window.location.href = result.data;
        } catch {
            notification.error({
                message: t`Can not sign in: secure browser cryptography is unavailable. Use HTTPS and try again.`,
            });
        }
    }, [originPathName]);
}

export function useAppleAuthentication() {
    useEffect(() => {
        const onSignInSuccess = (event: any) => {
            const authentication: AppleAuthenticationResponse = event.detail;
            signinWithIdentityToken(authentication.user?.name, authentication.authorization.id_token).then(() =>
                window.location.reload(),
            );
        };
        const onSignInFailure = (event: any) => {
            const error = event.detail?.error;
            if (error !== 'popup_closed_by_user') {
                console.error('Failed to sign in with Apple, error:', error);
                notification.error({
                    message: 'Can not sign in with Apple, please try again later',
                });
            }
        };
        document.addEventListener('AppleIDSignInOnSuccess', onSignInSuccess);
        document.addEventListener('AppleIDSignInOnFailure', onSignInFailure);

        AppleID.auth.init({
            clientId: 'software.beda.emr',
            scope: 'name',
            redirectURI: 'https://emr.beda.software/auth',
            usePopup: true,
        });

        return () => {
            document.removeEventListener('AppleIDSignInOnSuccess', onSignInSuccess);
            document.removeEventListener('AppleIDSignInOnFailure', onSignInFailure);
        };
    }, []);
}
