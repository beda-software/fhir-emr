import { InboxOutlined } from '@ant-design/icons';
import { Form, Upload, message } from 'antd';
import type { UploadFile } from 'antd';
import { Attachment } from 'fhir/r4b';
import { useRef, useState } from 'react';
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
    const { linkId, helpText, repeats } = questionItem;
    const fieldName = [...parentPath, linkId];
    const { formItem, value, onChange } = useFieldController(fieldName, questionItem);
    const ref = useRef<Record<string, string>>({});
    const uid = useRef<Record<string, string>>({});

    const initialFileList: Array<UploadFile> = (value ?? []).map((v: { value: { Attachment: Attachment } }) => {
        const url = v.value.Attachment.url!;
        const file: UploadFile = {
            uid: url,
            name: url,
            url: ref.current[url],
            thumbUrl: ref.current[url],
        };
        return file;
    });
    const [fileList, setFileList] = useState<Array<UploadFile>>(initialFileList);

    const hasUploadedFile = value?.length > 0;

    const multiple = repeats;
    const customRequest = async (options: CustomUploadRequestOption) => {
        const { file, onSuccess, onError, onProgress } = options;
        try {
            const { uploadUrl, filename } = await fetchUploadUrl((file as any).name);
            uid.current[(file as any).uid] = filename;

            uploadFileWithXHR(
                {
                    file,
                    onProgress,
                    onError,
                    onSuccess: async (body: any, xhr?: XMLHttpRequest | undefined) => {
                        const downloadUrl = await fetchDownloadUrl(filename);
                        ref.current[filename] = downloadUrl;
                        onSuccess && onSuccess(body, xhr);
                    },
                },
                uploadUrl,
            );
        } catch (error) {
            message.error(`${(file as any).name} file upload failed.`);
        }
    };
    const onUploaderChange = (info: { fileList: UploadFile<any>[]; file: UploadFile<any> }) => {
        setFileList(info.fileList);
        const { status } = info.file;
        if (status === 'done') {
            const filename = uid.current[info.file.uid];
            const attachement = { value: { Attachment: { url: filename } } };
            if (repeats) {
                onChange([...value, attachement]);
            } else {
                onChange([attachement]);
            }
            message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    };
    const onRemove = (file: UploadFile) => {
        console.log(file);
        onChange([]);
        setFileList([]);
    };

    return (
        <Form.Item {...formItem}>
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
                    <p className="ant-upload-hint">{helpText}</p>
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
