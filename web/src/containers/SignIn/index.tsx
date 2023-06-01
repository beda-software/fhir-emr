import { t } from '@lingui/macro';
import { Button, Segmented } from 'antd';
import Text from 'antd/lib/typography/Text';
import noop from 'lodash/noop';
import { useState } from 'react';

import { AppFooter } from 'src/components/BaseLayout/Footer';
import logo from 'src/images/logo.svg';
import { getAuthorizeUrl, OAuthState } from 'src/services/auth';

import { useAppleAuthentication } from './hooks';
import s from './SignIn.module.scss';

enum SignInService {
    EMR = 'EMR',
    PatientPortal = 'Patient Portal',
}

function authorize(state?: OAuthState) {
    window.location.href = getAuthorizeUrl(state);
}

interface SignInProps {
    originPathName?: string;
}

export function SignIn(props: SignInProps) {
    const [signInService, setSignInService] = useState<string>(SignInService.EMR);

    return (
        <div className={s.container}>
            <div className={s.form}>
                <div className={s.header}>
                    <Text className={s.title}>{t`Welcome to`}</Text>
                    <img src={logo} alt="" />
                </div>
                <Segmented
                    value={signInService}
                    options={[SignInService.EMR, SignInService.PatientPortal]}
                    block
                    onChange={(value) => setSignInService(value as SignInService)}
                    className={s.signInServiceSelectLabel}
                    // For some reason these two props are declared as required in antd
                    onResize={noop}
                    onResizeCapture={noop}
                />
                {signInService === SignInService.EMR ? (
                    <>
                        <div className={s.message}>
                            <b>{t`On the next page, please, use the following credentials`}</b>
                            <div>
                                {t`Username`}: admin <br />
                                {t`Password`}: password
                            </div>
                        </div>
                        <Button
                            type="primary"
                            onClick={() => authorize({ nextUrl: props.originPathName })}
                            size="large"
                        >
                            {t`Log in as Practitioner`}
                        </Button>
                    </>
                ) : (
                    <AppleButton />
                )}
            </div>
            <AppFooter type="light" />
        </div>
    );
}

function AppleButton(_props: {}) {
    useAppleAuthentication();

    return (
        <div
            className={s.appleSignInBtn}
            id="appleid-signin"
            data-color="black"
            data-border="true"
            data-type="sign-in"
        />
    );
}
