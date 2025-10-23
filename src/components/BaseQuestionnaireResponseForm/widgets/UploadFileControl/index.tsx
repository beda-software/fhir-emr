import { InboxOutlined } from '@ant-design/icons';
import { Trans } from '@lingui/macro';
import { Form, Upload } from 'antd';
import { QuestionItemProps } from 'sdc-qrf';

import { useUploader } from './hooks';

const { Dragger } = Upload;

export function UploadFileControl(props: QuestionItemProps) {
    const { showDragger, formItem, customRequest, onChange, onRemove, fileList, acceptedFileExtensions, disabled } =
        useUploader(props);
    const { repeats } = props.questionItem;

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
                    accept={acceptedFileExtensions}
                    disabled={disabled}
                >
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">
                        <Trans>Click or drag file to this area to upload</Trans>
                    </p>
                </Dragger>
            ) : (
                <Upload
                    listType="picture"
                    showUploadList={{ showRemoveIcon: true }}
                    fileList={fileList}
                    onRemove={onRemove}
                    disabled={disabled}
                />
            )}
        </Form.Item>
    );
}
