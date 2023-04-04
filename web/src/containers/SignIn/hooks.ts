import { notification } from 'antd';
import { useEffect } from 'react';

import { signinWithIdentityToken } from 'src/services/auth';

declare const AppleID: any;

export function useAppleAuthentication() {
    useEffect(() => {
        const onSignInSuccess = (event: any) => {
            signinWithIdentityToken(event.detail.user, event.detail.authorization.id_token).then(
                () => window.location.reload(),
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
