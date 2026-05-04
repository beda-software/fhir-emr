import { useService } from '@beda.software/fhir-react';
import { isSuccess, mapSuccess, success } from '@beda.software/remote-data';

import { generateDownloadUrl } from 'src/services/file-upload';

import { useRenderImageCache } from './cache';
import { RenderImageProps } from './types';

export function useRenderImage(props: RenderImageProps) {
    const { src } = props;
    const { getCachedUrl, getOrCreateInflight } = useRenderImageCache();

    const [response] = useService<string>(async () => {
        if (src.startsWith('http')) {
            return success(src);
        }

        const cached = getCachedUrl(src);
        if (cached) {
            return success(cached);
        }

        const url = await getOrCreateInflight(src, async () => {
            const resolved = mapSuccess(await generateDownloadUrl(src), ({ downloadUrl }) => downloadUrl);
            if (isSuccess(resolved)) {
                return resolved.data;
            }
            throw resolved;
        });

        return success(url);
    });

    return { response };
}
