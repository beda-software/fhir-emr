import { t } from '@lingui/macro';
import { Button, Segmented } from 'antd';
import { useState } from 'react';

import { AppFooter } from 'src/components/BaseLayout/Footer';
import logo from 'src/images/logo.svg';
import { getAuthorizeUrl, OAuthState } from 'src/services/auth';

import { useAppleAuthentication } from './hooks';
import s from './SignIn.module.scss';
import { S } from './SignIn.styles';

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
        <S.Container>
            <S.Form>
                <div className={s.header}>
                    <S.Text>{t`Welcome to`}</S.Text>
                    <img src={logo} alt="" />
                </div>
                <Segmented
                    value={signInService}
                    options={[SignInService.EMR, SignInService.PatientPortal]}
                    block
                    onChange={(value) => setSignInService(value as SignInService)}
                    className={s.signInServiceSelectLabel}
                />
                {signInService === SignInService.EMR ? (
                    <>
                        <S.Message>
                            <b>{t`On the next page, please, use the following credentials`}</b>
                            <div>
                                {t`Username`}: admin <br />
                                {t`Password`}: password
                            </div>
                        </S.Message>
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
            </S.Form>
            <AppFooter type="light" />
        </S.Container>
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
