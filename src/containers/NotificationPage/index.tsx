import { AppFooter } from 'src/components/BaseLayout/Footer';
import { CompanyName } from 'src/icons/brand/CompanyName';
import { LogoSmall } from 'src/icons/brand/LogoSmall';

import { NotificationPageProps } from './interfaces';
import { S } from './NotificationPage.styles';

export function NotificationPage(props: NotificationPageProps) {
    return (
        <S.Container>
            <S.Link to="/">
                <LogoSmall style={{ width: 25 }} color="#FFF" />
                <CompanyName color="#FFF" />
            </S.Link>
            <S.Title>{props.title}</S.Title>
            <S.TextContainer>
                <S.Text>{props.text}</S.Text>
            </S.TextContainer>
            <AppFooter type="light" />
        </S.Container>
    );
}
