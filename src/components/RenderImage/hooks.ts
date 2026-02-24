import { useService } from '@beda.software/fhir-react';
import { mapSuccess, success } from '@beda.software/remote-data';

import { generateDownloadUrl } from 'src/services/file-upload';

import { RenderImageProps } from './types';

export function useRenderImage(props: RenderImageProps) {
    const { src } = props;

    const [response] = useService<string>(async () => {
        if (src.startsWith('http')) {
            return success(src);
        }

        const url = mapSuccess(await generateDownloadUrl(src), ({ downloadUrl }) => {
            return downloadUrl;
        });

        return url;
    });

    return { response };
}
