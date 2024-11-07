import { InboxOutlined  } from '@ant-design/icons';
import { Form, Upload, message } from 'antd';
import type { UploadProps } from 'antd';
import { QuestionItemProps } from 'sdc-qrf';

import { useFieldController } from '../../hooks';

const { Dragger } = Upload;

type UploadFileProps = QuestionItemProps

export function UploadFileControl({ parentPath, questionItem }: UploadFileProps) {
    const { linkId, text } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value'];
    const { value, onChange, disabled, formItem } = useFieldController(fieldName, questionItem);

    const props: UploadProps = {
      name: 'file',
      multiple: true,
      action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',

      onChange(info) {
        const { status } = info.file;
        if (status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (status === 'done') {
          message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
      
      onDrop(e) {
        console.log('Dropped files', e.dataTransfer.files);
      },
    };

    return (
        <Form.Item {...formItem} label={text} >
            <Dragger {...props}
            >
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                  Support for a single or bulk upload
                </p>
            </Dragger>
        </Form.Item>
    );
}



