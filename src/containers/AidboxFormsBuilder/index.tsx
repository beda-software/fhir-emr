import { useParams } from 'react-router-dom';

import config from '@beda.software/emr-config';

import { S } from './styles';

export function AidboxFormsBuilder() {
    const params = useParams();
    const src = `${config.baseURL}/ui/sdc#/forms/builder${params.id ? `?form=${params.id}` : ''}`;

    return (
        <S.Container>
            <S.Content>
                <iframe src={src} title="Aidbox Forms Builder" />
            </S.Content>
        </S.Container>
    );
}
