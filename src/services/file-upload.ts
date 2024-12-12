import type { UploadRequestOption } from 'rc-upload/lib/interface';

import { service } from 'aidbox-react/lib/services/service';

import config from '@beda.software/emr-config';
import { mapSuccess } from '@beda.software/remote-data';

interface UploadUrlResponse {
    filename: string;
    put_presigned_url: string;
}

interface DownloadUrlResponse {
    get_presigned_url: string;
}

export async function generateUploadUrl(filename: string) {
    return mapSuccess(
        await service<UploadUrlResponse>({
            baseURL: config.baseURL,
            url: '/$generate-upload-url',
            method: 'POST',
            data: {
                filename,
            },
        }),
        (data) => ({ filename: data.filename, uploadUrl: data.put_presigned_url }),
    );
}

export async function generateDownloadUrl(key: string) {
    return mapSuccess(
        await service<DownloadUrlResponse>({
            baseURL: config.baseURL,
            url: '/$generate-download-url',
            method: 'POST',
            data: {
                key,
            },
        }),
        ({ get_presigned_url }) => ({ downloadUrl: get_presigned_url }),
    );
}

export type CustomUploadRequestOption = Pick<UploadRequestOption, 'file' | 'onProgress' | 'onError' | 'onSuccess'>;

export function uploadFileWithXHR(options: CustomUploadRequestOption, uploadUrl: string) {
    const { file, onProgress, onError, onSuccess } = options;
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', uploadUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/octet-stream');

    xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            onProgress && onProgress({ percent: percentComplete });
        }
    };

    xhr.onload = () => {
        if (xhr.status === 200) {
            onSuccess && onSuccess(null, xhr);
        } else {
            onError!(new Error(`File upload failed with status ${xhr.status}.`));
        }
    };

    xhr.onerror = () => {
        onError && onError(new Error('Network error during file upload.'));
    };

    xhr.send(file);
}
