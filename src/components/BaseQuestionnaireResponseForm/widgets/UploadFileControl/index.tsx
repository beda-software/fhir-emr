import { InboxOutlined } from '@ant-design/icons';
import { Form, Upload, message } from 'antd';
import { QuestionItemProps } from 'sdc-qrf';

import { isSuccess } from '@beda.software/remote-data';

import { generateDownloadUrl, generateUploadUrl } from 'src/services/file-upload';

import { useFieldController } from '../../hooks';

const { Dragger } = Upload;

type UploadFileProps = QuestionItemProps;

interface CustomRequestOptions {
    file: File;
    onError: (error: Error) => void;
    onSuccess: (body: any, file: File) => void;
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

async function uploadFileToUrl(file: File, uploadUrl: string) {
    const response = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
            'Content-Type': 'application/octet-stream',
        },
    });
    if (!response.ok) throw new Error("file upload failed.");
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
    const { linkId, text } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value'];
    const { formItem } = useFieldController(fieldName, questionItem);

    const props = {
        name: 'file',
        multiple: true,
        customRequest: async (options: CustomRequestOptions) => {
            const { file, onSuccess } = options;
            try {
                const { uploadUrl, filename } = await fetchUploadUrl(file);

                await uploadFileToUrl(file, uploadUrl);
                message.success(`${file.name} file uploaded successfully.`);
                onSuccess(null, file);

                const downloadUrl = await fetchDownloadUrl(filename);
                console.log("URL download:", downloadUrl);

            } catch (error) {
                console.error(error);
                message.error(`${file.name} file upload failed: `);

            }
        },
        onChange(info: { file: { name?: string; status?: string; } }) {
            const { status } = info.file;
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e: { dataTransfer: { files: FileList; } }) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    return (
        <Form.Item {...formItem} label={text}>
            <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                    Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                    banned files.
                </p>
            </Dragger>
        </Form.Item>
    );
}
