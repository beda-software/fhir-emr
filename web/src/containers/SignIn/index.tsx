import { t, Trans } from '@lingui/macro';
import { Button } from 'antd';
import Title from 'antd/lib/typography/Title';

import logo from 'src/images/logo-white.svg';
import { getAuthorizeUrl, OAuthState } from 'src/services/auth';

import s from './SignIn.module.scss';

function authorize(state?: OAuthState) {
    window.location.href = getAuthorizeUrl(state);
}

export function SignIn() {
    return (
        <div className={s.container}>
            <img src={logo} alt="" className={s.logo} />
            <Title className={s.title}>{t`Welcome`}</Title>
            <Button type="primary" className={s.loginBtn} onClick={() => authorize()} size="large">
                {t`Log in`}
            </Button>
            <div className={s.message}>
                <b>
                    <Trans>On the next page, please, use the following credentials</Trans>
                </b>
                <div>
                    <Trans>Username</Trans>: admin <br />
                    <Trans>Password</Trans>: password
                </div>
            </div>
        </div>
    );
}
