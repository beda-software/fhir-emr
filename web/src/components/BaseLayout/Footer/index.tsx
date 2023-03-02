import classNames from 'classnames';

import s from './Footer.module.scss';

interface Props {
    type?: 'default' | 'light';
}

export function AppFooter(props: Props) {
    const { type = "default" } = props;

    return (
        <div className={classNames(s.footer, s[`_${type}`])}>
            <div className={s.content}>
                Made with &#10084;&#65039; by{' '}
                <a href="https://beda.software/emr" target="_blank" className={s.link} rel="noreferrer">
                    Beda Software
                </a>
            </div>
        </div>
    );
}
