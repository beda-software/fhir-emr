import { Form } from 'antd';
import { ReactBarcode } from 'react-jsbarcode';
import { QuestionItemProps } from 'sdc-qrf';

import { useFieldController } from '../hooks';

export function Barcode({ parentPath, questionItem }: QuestionItemProps) {
    const { linkId } = questionItem;
    const fieldName = [...parentPath, linkId, 0, 'value', 'string'];
    const { value, formItem } = useFieldController<string>(fieldName, questionItem);
    return (
        <Form.Item {...formItem} data-testid={linkId}>
            <ReactBarcode value={value ?? ''} />
        </Form.Item>
    );
}
