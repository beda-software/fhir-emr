import { InboxOutlined } from '@ant-design/icons';
import { Form, Upload } from 'antd';
import { QuestionItemProps } from 'sdc-qrf';

import { useUploader } from './hooks';

const { Dragger } = Upload;

export function UploadFileControl(props: QuestionItemProps) {
    const { showDragger, formItem, customRequest, onChange, onRemove, fileList } = useUploader(props);
    const { helpText, repeats } = props.questionItem;
    return (
        <Form.Item {...formItem}>
            {showDragger ? (
                <Dragger
                    listType="picture"
                    multiple={repeats}
                    customRequest={customRequest}
                    onChange={onChange}
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

export function UploadFileControlReadOnly(props: QuestionItemProps) {
    const { formItem, fileList } = useUploader(props);
    return (
        <Form.Item {...formItem}>
            <Upload listType="picture" showUploadList={{ showRemoveIcon: true }} fileList={fileList} />
        </Form.Item>
    );
}
