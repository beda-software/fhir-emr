import { InboxOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Form, Upload, message, Tooltip } from 'antd';
import type { UploadFile } from 'antd';
import { useState } from 'react';
import { QuestionItemProps } from 'sdc-qrf';

import { isSuccess } from '@beda.software/remote-data';

import { generateDownloadUrl, generateUploadUrl, uploadFileWithXHR, CustomRequestOptions  } from 'src/services/file-upload';

import { useFieldController } from '../../hooks';

const { Dragger } = Upload;

type UploadFileProps = QuestionItemProps;

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
    const { linkId, text, helpText, repeats } = questionItem;
    const fieldName = [...parentPath, linkId];
    const { formItem, value, onChange } = useFieldController(fieldName, questionItem);

    const hasUploadedFile = value?.length > 0;
    const [fileList, setFileList] = useState<UploadFile<any>[]>([]);

    const props = {
        name: 'file',
        multiple: repeats,
        fileList,
        customRequest: async (options: CustomRequestOptions) => {
            const { file, onSuccess, onError, onProgress } = options;
            try {
                const { uploadUrl } = await fetchUploadUrl(file);

                const url = new URL(uploadUrl);
                const filename = url.pathname;
                console.log(filename);

                uploadFileWithXHR(
                    { file, onProgress, onError, onSuccess: async (_body, file) => {
                        onSuccess(null, file);
                        const downloadUrl = await fetchDownloadUrl(filename);
                        setFileList((prevList) =>
                            prevList.map((f) =>
                                f.uid === file.uid ? { ...f, thumbUrl: downloadUrl, url: downloadUrl } : f
                            )
                        );
                        const attachement = { value: { "Attachment": { "url": filename } } };
                        if (repeats) {
                            onChange([...value, attachement])
                        } else {
                            onChange([attachement])
                        }
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
            onChange([]);
        },
    };

    return (
        <Form.Item {...formItem} label={
            <span>
                {text}{' '}
                {helpText && (
                    <Tooltip title={helpText}>
                        <QuestionCircleOutlined />
                    </Tooltip>
                )}
            </span>
        }>
            {!hasUploadedFile || repeats ? (
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
