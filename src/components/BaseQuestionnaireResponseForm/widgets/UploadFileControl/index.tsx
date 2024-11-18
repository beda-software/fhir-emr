import { InboxOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Form, Upload, message, Tooltip } from 'antd';
import type { UploadFile } from 'antd';
import { Attachment } from 'fhir/r4b';
import { useRef } from 'react';
import { QuestionItemProps } from 'sdc-qrf';

import { isSuccess } from '@beda.software/remote-data';

import {
    generateDownloadUrl,
    generateUploadUrl,
    uploadFileWithXHR,
    CustomUploadRequestOption,
} from 'src/services/file-upload';

import { useFieldController } from '../../hooks';

const { Dragger } = Upload;

type UploadFileProps = QuestionItemProps;

async function fetchUploadUrl(fileName: string) {
    const response = await generateUploadUrl(fileName);
    if (isSuccess(response) && response.data?.put_presigned_url) {
        return {
            uploadUrl: response.data.put_presigned_url,
            filename: response.data.filename,
        };
    } else {
        throw new Error('file upload failed.');
    }
}

async function fetchDownloadUrl(filename: string) {
    const response = await generateDownloadUrl(filename);
    if (isSuccess(response) && response.data?.get_presigned_url) {
        return response.data.get_presigned_url;
    } else {
        throw new Error('url download failed');
    }
}

export function UploadFileControl({ parentPath, questionItem }: UploadFileProps) {
    const { linkId, text, helpText, repeats } = questionItem;
    const fieldName = [...parentPath, linkId];
    const { formItem, value, onChange } = useFieldController(fieldName, questionItem);
    const ref = useRef<Record<string, string>>({});

    const hasUploadedFile = value?.length > 0;
    const fileList: Array<UploadFile> = (value ?? []).map((v: { value: { Attachment: Attachment } }) => {
        const url = v.value.Attachment.url!;
        const file: UploadFile = {
            uid: url,
            name: url,
            url: ref.current[url],
            thumbUrl: ref.current[url],
        };
        return file;
    });

    const multiple = repeats;
    const customRequest = async (options: CustomUploadRequestOption) => {
        const { file, onSuccess, onError, onProgress } = options;
        try {
            const { uploadUrl, filename } = await fetchUploadUrl((file as any).name);

            uploadFileWithXHR(
                {
                    file,
                    onProgress,
                    onError,
                    onSuccess: async (body: any, xhr?: XMLHttpRequest | undefined) => {
                        onSuccess && onSuccess(body, xhr);
                        const downloadUrl = await fetchDownloadUrl(filename);
                        ref.current[filename] = downloadUrl;
                        const attachement = { value: { Attachment: { url: filename } } };
                        if (repeats) {
                            onChange([...value, attachement]);
                        } else {
                            onChange([attachement]);
                        }
                    },
                },
                uploadUrl,
            );
        } catch (error) {
            console.error(error);
        }
    };
    const onUploaderChange = (info: { fileList: UploadFile<any>[]; file: UploadFile<any> }) => {
        const { status } = info.file;
        if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    };
    const onRemove = () => {
        onChange([]);
    };

    return (
        <Form.Item
            {...formItem}
            label={
                <span>
                    {text}{' '}
                    {helpText && (
                        <Tooltip title={helpText}>
                            <QuestionCircleOutlined />
                        </Tooltip>
                    )}
                </span>
            }
        >
            {!hasUploadedFile || repeats ? (
                <Dragger
                    listType="picture"
                    multiple={multiple}
                    customRequest={customRequest}
                    onChange={onUploaderChange}
                    fileList={fileList}
                    onRemove={onRemove}
                >
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single upload. Strictly prohibited from uploading company data or other banned
                        files.
                    </p>
                </Dragger>
            ) : (
                <Upload
                    listType="picture"
                    showUploadList={{ showRemoveIcon: true }}
                    fileList={fileList}
                    onRemove={onRemove}
                />
            )}
        </Form.Item>
    );
}
