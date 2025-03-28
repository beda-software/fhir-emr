import { notification } from 'antd';
import { useEffect } from 'react';

import { signinWithIdentityToken } from 'src/services/auth';

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
