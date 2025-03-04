import { t } from '@lingui/macro';

import { S } from './Footer.styles';

interface Props {
    type?: 'default' | 'light';
}

export function AppFooter(props: Props) {
    const { type = 'default' } = props;

    return (
        <S.Footer className={`_${type}`}>
            <S.Content>
                <S.Text>
                    {t`Made with`} &#10084;&#65039; {t`by`}{' '}
                </S.Text>
                <S.Link href="https://beda.software/emr" target="_blank" rel="noreferrer">
                    Beda Software
                </S.Link>
            </S.Content>
        </S.Footer>
    );
}
