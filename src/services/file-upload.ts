import { service } from 'aidbox-react/lib/services/service';

import config from '@beda.software/emr-config';

interface UploadUrlResponse {
    filename: string;
    put_presigned_url: string;
}

interface DownloadUrlResponse {
    get_presigned_url: string;
}

export interface CustomRequestOptions {
    file: File;
    onProgress: (event: { percent: number }) => void;
    onError: (error: Error) => void;
    onSuccess: (body: any, file: File) => void;
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

export function uploadFileWithXHR(options: CustomRequestOptions, uploadUrl: string) {
    const { file, onProgress, onError, onSuccess } = options;
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', uploadUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/octet-stream');

    xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            onProgress({ percent: percentComplete });
        }
    };

    xhr.onload = () => {
        if (xhr.status === 200) {
            onSuccess(null, file);
        } else {
            onError(new Error(`File upload failed with status ${xhr.status}.`));
        }
    };

    xhr.onerror = () => {
        onError(new Error('Network error during file upload.'));
    };

    xhr.send(file);
}
