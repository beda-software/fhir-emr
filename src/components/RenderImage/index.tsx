import { RenderRemoteData } from '@beda.software/fhir-react';

import { Spinner } from 'src/components/Spinner';

import { useRenderImage } from './hooks';
import { S } from './styles';
import { RenderImageProps } from './types';

export function RenderImage(props: RenderImageProps) {
    const { alt } = props;

    const { response } = useRenderImage(props);

    return (
        <RenderRemoteData remoteData={response} renderLoading={Spinner}>
            {(url) => <S.Image src={url} alt={alt} />}
        </RenderRemoteData>
    );
}
