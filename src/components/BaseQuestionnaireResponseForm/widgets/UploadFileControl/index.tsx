import { InboxOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Form, Upload, message, Tooltip } from 'antd';
import type { UploadFile } from 'antd';
import { useState } from 'react';
import { QuestionItemProps } from 'sdc-qrf';

import { isSuccess } from '@beda.software/remote-data';

import { generateDownloadUrl, generateUploadUrl } from 'src/services/file-upload';

import { useFieldController } from '../../hooks';

const { Dragger } = Upload;
// TODO: get from Questionnaire
const repeat = false;

type UploadFileProps = QuestionItemProps;

interface CustomRequestOptions {
    file: File;
    onProgress: (event: { percent: number }) => void;
    onError: (error: Error) => void;
    onSuccess: (body: any, file: File) => void;
}

function uploadFileWithXHR(options: CustomRequestOptions, uploadUrl: string) {
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

async function fetchUploadUrl(file: File) {
    const response = await generateUploadUrl(file.name);
    if (isSuccess(response) && response.data?.put_presigned_url) {
        return {
            uploadUrl: response.data.put_presigned_url,
            filename: response.data.filename,
        };
    } else {
        throw new Error("file upload failed.");
    }
}

async function fetchDownloadUrl(filename: string) {
    const response = await generateDownloadUrl(filename);
    if (isSuccess(response) && response.data?.get_presigned_url) {
        return response.data.get_presigned_url;
    } else {
        throw new Error("url download failed");
    }
}

export function UploadFileControl({ parentPath, questionItem }: UploadFileProps) {
    const { linkId, text, helpText } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value'];
    const { formItem } = useFieldController(fieldName, questionItem);

    const [fileList, setFileList] = useState<UploadFile<any>[]>([]);
    const [hasUploadedFile, setHasUploadedFile] = useState(false);

    const props = {
        name: 'file',
        multiple: false,
        fileList,
        customRequest: async (options: CustomRequestOptions) => {
            const { file, onSuccess, onError, onProgress } = options;
            try {
                const { uploadUrl, filename } = await fetchUploadUrl(file);

                uploadFileWithXHR(
                    { file, onProgress, onError, onSuccess: async (body, file) => {
                        onSuccess(null, file);
                        const downloadUrl = await fetchDownloadUrl(filename);
                        setFileList((prevList) =>
                            prevList.map((f) =>
                                f.uid === file.uid ? { ...f, thumbUrl: downloadUrl, url: downloadUrl } : f
                            )
                        );
                        setHasUploadedFile(true);
                    }},
                    uploadUrl
                );
            } catch (error) {
                console.error(error);
            }
        },
        onChange(info: { fileList: UploadFile<any>[]; file: UploadFile<any> }) {
            const { status } = info.file;
            setFileList(info.fileList);
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onRemove: () => {
            setHasUploadedFile(false);
        },
    };

    return (
        <Form.Item {...formItem} label={
            (!hasUploadedFile || repeat) && (
                <span>
                    {text}{' '}
                    {helpText && (
                        <Tooltip title={helpText}>
                            <QuestionCircleOutlined />
                        </Tooltip>
                    )}
                </span>
            )
        }>
            {!hasUploadedFile || repeat ? (
                <Dragger {...props} listType="picture">
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single upload. Strictly prohibited from uploading company data or other banned files.
                    </p>
                </Dragger>
            ) : (
                <Upload {...props} listType="picture" showUploadList={{ showRemoveIcon: true }} />
            )}
        </Form.Item>
    );
}