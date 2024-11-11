import { service } from 'aidbox-react/lib/services/service';

import config from '@beda.software/emr-config';

interface UploadUrlResponse {
    filename: string;
    put_presigned_url: string;
}

interface DownloadUrlResponse {
    get_presigned_url: string;
}

export async function generateUploadUrl(filename: string) {
    return await service<UploadUrlResponse>({
        baseURL: config.baseURL,
        url: '/$generate-upload-url',
        method: 'POST',
        data: {
           filename,
        },
    });
}

export async function generateDownloadUrl(key: string) {
    return await service<DownloadUrlResponse>({
        baseURL: config.baseURL,
        url: '/$generate-download-url',
        method: 'POST',
        data: {
            key,
        },
    });
}
